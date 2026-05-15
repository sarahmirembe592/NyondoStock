from datetime import timedelta

from django.db.models import Sum
from django.utils import timezone
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Product, StockEntry
from .serializers import ProductSerializer, StockEntrySerializer

LOW_STOCK_THRESHOLD = 10


class ProductViewSet(viewsets.ModelViewSet):
    """List and manage products."""

    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    http_method_names = ['get', 'post', 'head', 'options']


class StockEntryViewSet(viewsets.ModelViewSet):
    """Register stock arrivals and list history."""

    queryset = StockEntry.objects.select_related('product').all()
    serializer_class = StockEntrySerializer
    http_method_names = ['get', 'post', 'head', 'options']


@api_view(['GET'])
def health(request):
    return Response({'status': 'ok'})


@api_view(['GET'])
def dashboard(request):
    """Summary counts for the dashboard (real data from the database)."""
    week_ago = timezone.now() - timedelta(days=7)

    product_count = Product.objects.filter(is_active=True).count()
    total_stock_units = (
        StockEntry.objects.aggregate(total=Sum('quantity'))['total'] or 0
    )
    entries_this_week = StockEntry.objects.filter(received_at__gte=week_ago).count()

    low_stock_products = []
    for product in Product.objects.filter(is_active=True):
        if product.quantity_on_hand < LOW_STOCK_THRESHOLD:
            low_stock_products.append({
                'id': product.id,
                'name': product.name,
                'quantity_on_hand': product.quantity_on_hand,
                'unit': product.unit,
            })

    return Response({
        'product_count': product_count,
        'total_stock_units': total_stock_units,
        'stock_entries_this_week': entries_this_week,
        'low_stock_count': len(low_stock_products),
        'low_stock_products': low_stock_products,
    })