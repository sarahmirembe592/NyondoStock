from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


def validate_selling_price_above_cost(unit_cost, unit_price):
    """Selling price must be greater than unit cost (project requirement)."""
    if unit_price <= unit_cost:
        raise ValidationError(
            _('Selling price must be greater than unit cost.'),
            code='price_not_above_cost',
        )