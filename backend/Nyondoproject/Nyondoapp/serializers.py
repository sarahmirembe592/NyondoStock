from rest_framework import serializers

from .models import Product, StockEntry
from .validators import validate_selling_price_above_cost


class ProductSerializer(serializers.ModelSerializer):
    quantity_on_hand = serializers.IntegerField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'category',
            'unit',
            'is_active',
            'quantity_on_hand',
            'created_at',
        ]
        read_only_fields = ['created_at']


class StockEntrySerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_unit = serializers.CharField(source='product.unit', read_only=True)

    class Meta:
        model = StockEntry
        fields = [
            'id',
            'product',
            'product_name',
            'product_unit',
            'quantity',
            'unit_cost',
            'unit_price',
            'received_at',
            'note',
            'created_at',
        ]
        read_only_fields = ['created_at', 'product_name', 'product_unit']

    def validate(self, attrs):
        unit_cost = attrs.get('unit_cost', getattr(self.instance, 'unit_cost', None))
        unit_price = attrs.get('unit_price', getattr(self.instance, 'unit_price', None))
        if unit_cost is not None and unit_price is not None:
            validate_selling_price_above_cost(unit_cost, unit_price)
        return attrs