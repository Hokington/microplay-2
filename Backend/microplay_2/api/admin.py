from django.contrib import admin
from .models import Account, Category, Platform, Product, Order, OrderDetail, Payment, Review, CartItem

admin.site.register(Account)
admin.site.register(Category)
admin.site.register(Platform)
admin.site.register(Product)
admin.site.register(Order)
admin.site.register(OrderDetail)
admin.site.register(Payment)
admin.site.register(Review)
admin.site.register(CartItem)