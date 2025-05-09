from rest_framework import serializers
from .models import Product, Order, OrderDetail, Account, Review, Payment, CartItem, Category, Platform

class CategorySerializer(serializers.ModelSerializer):
    subcategories = serializers.SerializerMethodField()
    parent_name = serializers.ReadOnlyField(source='parent.name')

    class Meta:
        model = Category
        fields = ['id', 'name', 'parent', 'parent_name', 'subcategories']

    def get_subcategories(self, obj):
        return CategorySerializer(obj.subcategories.all(), many=True).data

class PlatformSerializer(serializers.ModelSerializer):
    class Meta:
        model = Platform
        fields = ['id', 'name']

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), source="category", write_only=True)
    platform = PlatformSerializer(read_only=True)
    platform_id = serializers.PrimaryKeyRelatedField(queryset=Platform.objects.all(), source='platform', write_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'stock', 'release_date',
            'category', 'category_id', 'platform', 'platform_id', 'image'
        ]

    def update(self, instance, validated_data):
        image = validated_data.get("image", None)
        if image is None and "image" not in self.context["request"].FILES:
            validated_data.pop("image", None)
        return super().update(instance, validated_data)

class AccountSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Account
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'phone', 'address', 'role', 'password']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = Account(**validated_data)
        user.set_password(password)
        user.save()
        return user
    
class OrderDetailSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), source='product', write_only=True)

    class Meta:
        model = OrderDetail
        fields = ['id', 'order', 'product', 'product_id', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    account = AccountSerializer(read_only=True)
    details = OrderDetailSerializer(source='orderdetail_set', many=True, read_only=True)
    items = OrderDetailSerializer(many=True, write_only=True)

    class Meta:
        model = Order
        fields = ['id', 'account', 'order_date', 'status', 'total', 'items', 'details']

class PaymentSerializer(serializers.ModelSerializer):
    order = OrderSerializer(read_only=True)
    order_id = serializers.PrimaryKeyRelatedField(queryset=Order.objects.all(), source='order', write_only=True)

    class Meta:
        model = Payment
        fields = ['id', 'order', 'method', 'amount', 'date', 'status']

class ReviewSerializer(serializers.ModelSerializer):
    account = AccountSerializer(read_only=True)
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )

    class Meta:
        model = Review
        fields = ['id', 'account', 'product', 'product_id', 'rating', 'comment', 'date']

class CartItemSerializer(serializers.ModelSerializer):
    account = AccountSerializer(read_only=True)
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), source='product', write_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity', 'product_id', 'account']
        read_only_fields = ['id', 'account']
