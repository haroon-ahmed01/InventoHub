from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Product, StockReport
from .serializers import ProductSerializer, StockReportSerializer
from .permissions import IsAdminUser
from django.db.models import Q, F, ExpressionWrapper, DecimalField
from django.db.models import Count, Sum

# Create your views here.

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Product.objects.all()
        search = self.request.query_params.get('search', None)
        min_quantity = self.request.query_params.get('min_quantity', None)
        max_quantity = self.request.query_params.get('max_quantity', None)
        min_price = self.request.query_params.get('min_price', None)
        max_price = self.request.query_params.get('max_price', None)

        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(description__icontains=search)
            )
        
        if min_quantity:
            queryset = queryset.filter(quantity__gte=min_quantity)
        
        if max_quantity:
            queryset = queryset.filter(quantity__lte=max_quantity)

        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        
        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        return queryset

    @action(detail=False, methods=['get'])
    def stats(self, request):
        total_products = Product.objects.count()
        low_stock_products = Product.objects.filter(quantity__lt=10).count()
        
        # Fix the total value calculation using F expressions
        total_value = Product.objects.aggregate(
            total=Sum(
                ExpressionWrapper(
                    F('quantity') * F('price'),
                    output_field=DecimalField()
                )
            )
        )['total'] or 0

        return Response({
            'total_products': total_products,
            'low_stock_products': low_stock_products,
            'total_value': float(total_value)
        })

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticated()]

class StockReportViewSet(viewsets.ModelViewSet):
    queryset = StockReport.objects.all()
    serializer_class = StockReportSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = StockReport.objects.all()
        
        # Filter parameters
        is_resolved = self.request.query_params.get('is_resolved', None)
        product_id = self.request.query_params.get('product_id', None)
        date_from = self.request.query_params.get('date_from', None)
        date_to = self.request.query_params.get('date_to', None)
        reporter = self.request.query_params.get('reporter', None)

        if is_resolved is not None:
            is_resolved = is_resolved.lower() == 'true'
            queryset = queryset.filter(is_resolved=is_resolved)
        
        if product_id:
            queryset = queryset.filter(product_id=product_id)

        if date_from:
            queryset = queryset.filter(created_at__gte=date_from)

        if date_to:
            queryset = queryset.filter(created_at__lte=date_to)

        if reporter:
            queryset = queryset.filter(reported_by__username__icontains=reporter)

        # Non-admin users can only see their own reports
        if not self.request.user.user_type == 'admin':
            queryset = queryset.filter(reported_by=self.request.user)

        return queryset.order_by('-created_at')

    @action(detail=False, methods=['get'])
    def stats(self, request):
        queryset = self.get_queryset()
        total_reports = queryset.count()
        pending_reports = queryset.filter(is_resolved=False).count()
        
        reports_by_product = queryset.values(
            'product__name'
        ).annotate(
            report_count=Count('id')
        ).order_by('-report_count')[:5]

        reports_by_day = queryset.extra(
            select={'day': 'DATE(created_at)'}
        ).values('day').annotate(
            count=Count('id')
        ).order_by('-day')[:7]

        return Response({
            'total_reports': total_reports,
            'pending_reports': pending_reports,
            'reports_by_product': reports_by_product,
            'reports_by_day': reports_by_day
        })

    def perform_create(self, serializer):
        serializer.save(reported_by=self.request.user)

    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        report = self.get_object()
        report.is_resolved = True
        report.save()
        return Response({'status': 'report resolved'})
