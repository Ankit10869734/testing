from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Complaint


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return str(refresh.access_token), str(refresh)


@login_required
def google_auth_callback(request):
    print("=" * 60)
    print("🔵 google_auth_callback called!")
    print(f"User authenticated: {request.user.is_authenticated}")
    print(f"User: {request.user}")
    print(f"Username: {request.user.username}")
    print(f"Email: {request.user.email}")
    
    user = request.user
    
    # Try to get real email from social account
    try:
        social = user.socialaccount_set.filter(provider='google').first()
        if social and social.extra_data:
            print(f"Social account found: {social}")
            print(f"Email from Google: {social.extra_data.get('email')}")
            email = social.extra_data.get('email')
            if email and user.email != email:
                user.email = email
                user.save()
                print(f"✅ Email updated to: {email}")
    except Exception as e:
        print(f"❌ Error updating email: {e}")
    
    access, refresh = get_tokens_for_user(user)
    
    print(f"Access token generated: {access[:50]}...")
    print(f"Refresh token generated: {refresh[:50]}...")
    
    redirect_url = f'http://localhost:5173/auth/callback?access={access}&refresh={refresh}'
    print(f"Redirecting to: {redirect_url[:100]}...")
    print("=" * 60)
    
    return redirect(redirect_url)

@api_view(['GET'])
@permission_classes([AllowAny])
def landing_data(request):
    return Response({'app': 'CGMS', 'version': 'v3.0'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user
    avatar = None
    try:
        social = user.socialaccount_set.filter(provider='google').first()
        if social:
            avatar = social.get_avatar_url()
    except Exception:
        pass
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'name': user.get_full_name() or user.username,
        'avatar': avatar,
        'first_initial': (user.email[0] if user.email else 'U').upper(),
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_complaint(request):
    """Submit a new complaint"""
    
    user = request.user
    data = request.data
    
    complaint = Complaint.objects.create(
        user=user,
        title=data.get('title'),
        description=data.get('description'),
        category=data.get('category'),
        priority=data.get('priority', 'medium'),
        status='pending'
    )
    
    return Response({
        'success': True,
        'message': 'Complaint submitted successfully',
        'complaint_id': complaint.id
    }, status=201)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_complaints(request):
    """Get all complaints for the logged-in user"""
    
    user = request.user
    complaints = Complaint.objects.filter(user=user).order_by('-created_at')
    
    data = [{
        'id': c.id,
        'title': c.title,
        'description': c.description,
        'category': c.category,
        'priority': c.priority,
        'status': c.status,
        'created_at': c.created_at,
        'updated_at': c.updated_at,
    } for c in complaints]
    
    return Response(data)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_user_complaint(request, complaint_id):
    """Update user's own complaint (only if pending)"""
    
    try:
        complaint = Complaint.objects.get(id=complaint_id, user=request.user)
        
        if complaint.status != 'pending':
            return Response({
                'error': 'Cannot edit complaint that is already being processed'
            }, status=400)
        
        complaint.title = request.data.get('title', complaint.title)
        complaint.description = request.data.get('description', complaint.description)
        complaint.category = request.data.get('category', complaint.category)
        complaint.priority = request.data.get('priority', complaint.priority)
        complaint.save()
        
        return Response({'success': True, 'message': 'Complaint updated'})
    
    except Complaint.DoesNotExist:
        return Response({'error': 'Complaint not found'}, status=404)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user_complaint(request, complaint_id):
    """Delete user's own complaint (only if pending)"""
    
    try:
        complaint = Complaint.objects.get(id=complaint_id, user=request.user)
        
        if complaint.status != 'pending':
            return Response({
                'error': 'Cannot delete complaint that is already being processed'
            }, status=400)
        
        complaint.delete()
        return Response({'success': True, 'message': 'Complaint deleted'})
    
    except Complaint.DoesNotExist:
        return Response({'error': 'Complaint not found'}, status=404)