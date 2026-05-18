import api from './axios'

export const adminAPI = {
  // Get dashboard stats
  getStats: () => api.get('/admin/stats/'),
  
  // Get all complaints
  getComplaints: () => api.get('/admin/complaints/'),
  
  // Update complaint status
  updateStatus: (id, status) => api.patch(`/admin/complaints/${id}/status/`, { status }),
  
  // Get recent activity
  getActivity: () => api.get('/admin/activity/'),
  
  // Get all users
  getUsers: () => api.get('/admin/users/'),
}