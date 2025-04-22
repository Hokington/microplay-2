from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AccountViewSet, CategoryViewSet, PlatformViewSet, ProductViewSet,
    OrderViewSet, OrderDetailViewSet, PaymentViewSet, ReviewViewSet, CartItemViewSet
)

from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'accounts', AccountViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'platforms', PlatformViewSet)
router.register(r'products', ProductViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'order-details', OrderDetailViewSet)
router.register(r'payments', PaymentViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'cart-items', CartItemViewSet)


urlpatterns = [
    path('', include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
