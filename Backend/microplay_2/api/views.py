from rest_framework import viewsets, permissions, filters
from .models import Account, Category, Platform, Product, Order, OrderDetail, Payment, Review, CartItem
from .serializers import (
    AccountSerializer, CategorySerializer, PlatformSerializer, ProductSerializer,
    OrderSerializer, OrderDetailSerializer, PaymentSerializer, ReviewSerializer, CartItemSerializer
)
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.decorators import authentication_classes, permission_classes
from .permissions import IsAdminRole, IsAdminUserOrReadOnly
from django.conf import settings
import stripe

@api_view(['POST'])
def login(request):
    user = get_object_or_404(Account, username=request.data['username'])

    if not user.check_password(request.data['password']):
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    
    token, created = Token.objects.get_or_create(user=user)
    serializer = AccountSerializer(instance=user)

    return Response({'token': token.key, 'user': {'username': user.username, 'email': user.email, 'role': user.role }}, status=status.HTTP_200_OK)

@api_view(['POST'])
def register(request):
    serializer = AccountSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()
        token = Token.objects.create(user=user)
        return Response({'token': token.key, 'user': serializer.data}, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def logout(request):
    request.user.auth_token.delete()
    return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)


class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = [IsAdminRole]


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminUserOrReadOnly]


class PlatformViewSet(viewsets.ModelViewSet):
    queryset = Platform.objects.all()
    serializer_class = PlatformSerializer
    permission_classes = [IsAdminUserOrReadOnly]


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = {
        'id': ['exact'],
        'name': ['icontains', 'exact'],
        'description': ['icontains', 'exact'],
        'price': ['exact', 'gte', 'lte'],
        'stock': ['exact', 'gte', 'lte'],
        'release_date': ['exact', 'gte', 'lte'],
        'category': ['exact'],
        'category__id': ['exact'],
        'category__name': ['icontains', 'exact'],
        'category__parent': ['exact'],
        'platform': ['exact'],
        'platform__id': ['exact'],
        'platform__name': ['icontains', 'exact'],
    }

    ordering_fields = ['id', 'name', 'price', 'stock', 'release_date']
    ordering = ['id']

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAdminRole]

    @action(detail=False, methods=['get'], url_path='my-orders', permission_classes=[IsAuthenticated])
    def my_orders(self, request):
        account = request.user
        orders = Order.objects.filter(account=account)
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='from-cart', permission_classes=[IsAuthenticated])
    def create_from_cart(self, request):
        cart_items = CartItem.objects.filter(account=self.request.user)

        if not cart_items.exists():
            return Response({'error': 'El carrito está vacío.'}, status=status.HTTP_400_BAD_REQUEST)

        # STRIPE
        line_items = []
        for item in cart_items:
            line_items.append({
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': item.product.name,
                        'images': [request.build_absolute_uri(item.product.image.url)] if item.product.image else None,
                        'description': item.product.description,
                    },
                    'unit_amount': int(item.product.price / 1000) * 100,
                },
                'quantity': item.quantity,
            })


        total = sum(item.product.price * item.quantity for item in cart_items)

        order = Order.objects.create(
            account=self.request.user,
            status='pagado',
            total=total,
        )

        for item in cart_items:
            OrderDetail.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price
            )
            Product.objects.filter(id=item.product.id).update(stock=item.product.stock - item.quantity)

        Payment.objects.create(
            order=order,
            method='stripe',
            amount=total,
            status='completado'
        )

        cart_items.delete()

        serializer = OrderSerializer(order)
       
        stripe.api_key = settings.STRIPE_SECRET_KEY
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=line_items,
            mode='payment',
            success_url=f"{settings.FRONT_END_SUCCESS_URL}",
            cancel_url=f"{settings.FRONT_END_CANCEL_URL}",
        )

        order.stripe_session_id = checkout_session.id
        order.save()

        return Response({'session_id': checkout_session.id}, status=status.HTTP_200_OK)

class OrderDetailViewSet(viewsets.ModelViewSet):
    queryset = OrderDetail.objects.all()
    serializer_class = OrderDetailSerializer
    permission_classes = [IsAdminRole]


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAdminRole]


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        product_id = self.request.query_params.get('product_id')
        if product_id:
            return Review.objects.filter(product_id=product_id)
        return Review.objects.all()


    def perform_create(self, serializer):
        serializer.save(account=self.request.user)

    def destroy(self, request, *args, **kwargs):
        if not request.user.is_authenticated or request.user.role != 'administrativo':
            return Response({'detail': 'No tienes permiso para eliminar.'}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)
    
class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.none()
    serializer_class = CartItemSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(account=self.request.user)
    
    def perform_create(self, serializer):
        existing_item = CartItem.objects.filter(
            account=self.request.user,
            product=serializer.validated_data['product']
        ).first()

        if existing_item:
            existing_item.quantity += serializer.validated_data['quantity']
            existing_item.save()
        else:
            serializer.save(account=self.request.user)

    def perform_update(self, serializer):
        if serializer.validated_data['quantity'] <= 0:
            serializer.instance.delete()
        else:
            serializer.save(account=self.request.user)

    def perform_destroy(self, instance):
        instance.delete()