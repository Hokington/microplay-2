from django.contrib.auth.models import AbstractUser
from django.db import models


class Account(AbstractUser):
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)

    ROLE_CHOICES = (
        ('cliente', 'Cliente'),
        ('administrativo', 'Administrativo'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='cliente')

    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.username} ({self.role})"

class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name="subcategories")

    def __str__(self):
        return self.name if not self.parent else f"{self.parent.name} > {self.name}"

class Platform(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    release_date = models.DateField(null=True, blank=True)
    platform = models.ForeignKey(Platform, null=True, blank=True, on_delete=models.SET_NULL)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="products")
    image = models.ImageField(upload_to='product_images/', null=True, blank=True)
    
    def __str__(self):
        return self.name

class Order(models.Model):
    account = models.ForeignKey('Account', on_delete=models.CASCADE)
    order_date = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=15)
    total = models.IntegerField()

    def __str__(self):
        return f"Order {self.id} by {self.account.username}"

class OrderDetail(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey('Product', on_delete=models.CASCADE)
    quantity = models.IntegerField()
    price = models.IntegerField()

class Payment(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    method = models.CharField(max_length=20)
    amount = models.IntegerField()
    date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10)

class CartItem(models.Model):
    account = models.ForeignKey('Account', on_delete=models.CASCADE)
    product = models.ForeignKey('Product', on_delete=models.CASCADE)
    quantity = models.IntegerField()

class Review(models.Model):
    account = models.ForeignKey('Account', on_delete=models.CASCADE)
    product = models.ForeignKey('Product', on_delete=models.CASCADE)
    rating = models.IntegerField()
    comment = models.CharField(max_length=250)
    date = models.DateTimeField(auto_now_add=True)
