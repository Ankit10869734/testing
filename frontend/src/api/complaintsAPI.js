import api from './axios'

export const complaintsAPI = {
  // Submit new complaint
  submit: (data) => api.post('/complaints/submit/', data),
  
  // Get user's complaints
  getMy: () => api.get('/complaints/my/'),
  
  // Update complaint (only if pending)
  update: (id, data) => api.patch(`/complaints/${id}/update/`, data),
  
  // Delete complaint (only if pending)
  delete: (id) => api.delete(`/complaints/${id}/delete/`),
}