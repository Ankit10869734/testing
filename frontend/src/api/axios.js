import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        const refresh = localStorage.getItem('refresh')
        if (!refresh) {
          // No refresh token, redirect to login
          localStorage.clear()
          window.location.href = '/login'
          return Promise.reject(error)
        }
        
        const res = await axios.post('http://localhost:8000/api/auth/token/refresh/', { refresh })
        localStorage.setItem('access', res.data.access)
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${res.data.access}`
        return axios(originalRequest)
      } catch (refreshError) {
        // Refresh failed, logout
        localStorage.clear()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }
    
    return Promise.reject(error)
  }
)

export default api