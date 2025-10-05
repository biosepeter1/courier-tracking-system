import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  uploadProfileImage: (formData) => {
    return api.post('/auth/profile/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  changePassword: (passwordData) => api.post('/auth/change-password', passwordData),
  forgotPassword: (email) => axios.post(`${API_BASE_URL}/auth/forgot-password`, { email }),
  resetPassword: (token, password) => axios.post(`${API_BASE_URL}/auth/reset-password`, { token, password }),
  logout: () => api.post('/auth/logout'),
  listUsers: (params) => api.get('/auth/users', { params }), // Admin only
}

// Shipment API calls
export const shipmentAPI = {
  // Public
  getByTrackingNumber: (trackingNumber) => 
    axios.get(`${API_BASE_URL}/shipments/tracking/${trackingNumber}`),
  
  // Protected
  create: (shipmentData) => api.post('/shipments', shipmentData),
  getAll: (params = {}) => api.get('/shipments', { params }),
  getById: (id) => api.get(`/shipments/${id}`),
  update: (id, updateData) => api.put(`/shipments/${id}/update`, updateData),
  updateDetails: (id, detailsData) => api.put(`/shipments/${id}/details`, detailsData),
  delete: (id) => api.delete(`/shipments/${id}`),
  getStats: () => api.get('/shipments/admin/stats'),
}

// Contact API calls
export const contactAPI = {
  // Public
  submit: (contactData) => axios.post(`${API_BASE_URL}/contact`, contactData),
  
  // Admin only
  getAll: (params = {}) => api.get('/contact', { params }),
  getById: (id) => api.get(`/contact/${id}`),
  reply: (id, replyData) => api.post(`/contact/${id}/reply`, replyData),
  updateStatus: (id, status) => api.patch(`/contact/${id}/status`, { status }),
  delete: (id) => api.delete(`/contact/${id}`),
}

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
}

export default api
