from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/register/', views.register_user, name='register'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
] 