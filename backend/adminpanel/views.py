from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken
from main.models import Complaint
from django.db.models import Count, Q
from datetime import datetime, timedelta


@api_view(['POST'])
def admin_login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(username=username, password=password)

    if user and user.is_staff:
        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "role": "admin",
            "username": user.username
        })

    return Response({"error": "Invalid admin credentials"}, status=401)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_dashboard_stats(request):
    """Get dashboard statistics"""
    
    total_complaints = Complaint.objects.count()
    pending = Complaint.objects.filter(status='pending').count()
    in_progress = Complaint.objects.filter(status='in_progress').count()
    resolved = Complaint.objects.filter(status='resolved').count()
    critical = Complaint.objects.filter(priority='critical', status='pending').count()
    
    return Response({
        "total_complaints": total_complaints,
        "pending": pending,
        "in_progress": in_progress,
        "resolved": resolved,
        "critical_pending": critical
    })


@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_all_complaints(request):
    """Get all complaints with user details"""
    
    complaints = Complaint.objects.select_related('user').all()
    
    data = [{
        "id": c.id,
        "title": c.title,
        "description": c.description,
        "category": c.category,
        "status": c.status,
        "priority": c.priority,
        "user": c.user.username,
        "user_email": c.user.email,
        "created_at": c.created_at,
        "updated_at": c.updated_at,
    } for c in complaints]
    
    return Response(data)


@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def update_complaint_status(request, complaint_id):
    """Update complaint status"""
    
    try:
        complaint = Complaint.objects.get(id=complaint_id)
        new_status = request.data.get('status')
        
        if new_status in dict(Complaint.STATUS_CHOICES):
            complaint.status = new_status
            
            if new_status == 'resolved':
                complaint.resolved_at = datetime.now()
            
            complaint.save()
            return Response({"message": "Status updated successfully"})
        
        return Response({"error": "Invalid status"}, status=400)
    
    except Complaint.DoesNotExist:
        return Response({"error": "Complaint not found"}, status=404)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_recent_activity(request):
    """Get recent complaints activity"""
    
    recent = Complaint.objects.select_related('user').order_by('-created_at')[:10]
    
    data = [{
        "id": c.id,
        "title": c.title,
        "user": c.user.username,
        "status": c.status,
        "priority": c.priority,
        "created_at": c.created_at
    } for c in recent]
    
    return Response(data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_all_users(request):
    """Get all users"""
    
    users = User.objects.annotate(
        complaint_count=Count('complaints')
    ).all()
    
    data = [{
        "id": u.id,
        "username": u.username,
        "email": u.email,
        "is_staff": u.is_staff,
        "date_joined": u.date_joined,
        "complaint_count": u.complaint_count
    } for u in users]
    
    return Response(data)