from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Product, StockEntry
from .serializers import ProductSerializer, StockEntrySerializer


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