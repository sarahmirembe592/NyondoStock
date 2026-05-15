from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register('products', views.ProductViewSet, basename='product')
router.register('stock', views.StockEntryViewSet, basename='stock')

urlpatterns = [
    path('health/', views.health, name='health'),
    path('', include(router.urls)),
     path('health/', views.health, name='health'),
    path('dashboard/', views.dashboard, name='dashboard'),
    # path('', include(router.urls)),
]