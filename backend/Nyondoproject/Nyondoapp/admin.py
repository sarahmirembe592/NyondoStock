from django.contrib import admin

from .models import Product, StockEntry


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'unit', 'is_active', 'created_at')
    list_filter = ('category', 'is_active')
    search_fields = ('name',)


@admin.register(StockEntry)
class StockEntryAdmin(admin.ModelAdmin):
    list_display = (
        'product',
        'quantity',
        'unit_cost',
        'unit_price',
        'received_at',
        'created_at',
    )
    list_filter = ('received_at',)
    search_fields = ('product__name', 'note')
    autocomplete_fields = ('product',)