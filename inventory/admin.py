from django.contrib import admin
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'quantity', 'price', 'created_by', 'created_at')
    list_filter = ('created_by', 'created_at')
    search_fields = ('name', 'description')
