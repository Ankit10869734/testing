from django.contrib import admin
from django.urls import path, include
from main.views import google_auth_callback

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('allauth.urls')),
    path('auth-success/', google_auth_callback),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('api/', include('main.urls')),
    path('api/admin/', include('adminpanel.urls')),  # ✅ CHANGED THIS LINE
]