from django.db import models
from django.db.models import Sum
from .validators import validate_selling_price_above_cost

# Create your models here.



class Product(models.Model):
    """Hardware item sold or stocked at Nyondo (cement, nails, iron bars, etc.)."""

    class Category(models.TextChoices):
        CEMENT = 'cement', 'Cement'
        IRON_BARS = 'iron_bars', 'Iron bars'
        NAILS = 'nails', 'Nails'
        IRON_SHEETS = 'iron_sheets', 'Iron sheets'
        OTHER = 'other', 'Other'

    name = models.CharField(max_length=200)
    category = models.CharField(max_length=32, choices=Category.choices)
    unit = models.CharField(
        max_length=32,
        help_text='How this product is counted (e.g. bag, piece, kg).',
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

    @property
    def quantity_on_hand(self):
        """Total units received across all stock entries (sales not deducted yet)."""
        total = self.stock_entries.aggregate(total=Sum('quantity'))['total']
        return total or 0


class StockEntry(models.Model):
    """Stock registered on arrival: quantity, cost, and selling price per unit."""

    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name='stock_entries',
    )
    quantity = models.PositiveIntegerField()
    unit_cost = models.DecimalField(max_digits=12, decimal_places=2)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    received_at = models.DateTimeField()
    note = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-received_at', '-id']
        verbose_name_plural = 'stock entries'

    def __str__(self):
        return f'{self.product.name} — {self.quantity} {self.product.unit}'

    def clean(self):
        super().clean()
        validate_selling_price_above_cost(self.unit_cost, self.unit_price)

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)