from django.urls import path
from . import views

urlpatterns = [
    path('landing/', views.landing_data),
    path('profile/', views.user_profile),
    path('complaints/submit/', views.submit_complaint, name='submit_complaint'),
    path('complaints/my/', views.get_user_complaints, name='my_complaints'),
    path('complaints/<int:complaint_id>/update/', views.update_user_complaint, name='update_complaint'),
    path('complaints/<int:complaint_id>/delete/', views.delete_user_complaint, name='delete_complaint'),
]