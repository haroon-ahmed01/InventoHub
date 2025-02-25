from rest_framework import serializers
from .models import Product, StockReport

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class StockReportSerializer(serializers.ModelSerializer):
    reported_by_username = serializers.CharField(source='reported_by.username', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = StockReport
        fields = '__all__' 