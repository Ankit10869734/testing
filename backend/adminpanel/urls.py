from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.admin_login, name='admin_login'),
    path('stats/', views.get_dashboard_stats, name='dashboard_stats'),
    path('complaints/', views.get_all_complaints, name='all_complaints'),
    path('complaints/<int:complaint_id>/status/', views.update_complaint_status, name='update_status'),
    path('activity/', views.get_recent_activity, name='recent_activity'),
    path('users/', views.get_all_users, name='all_users'),
]