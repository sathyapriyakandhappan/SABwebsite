import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sab_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        localStorage.removeItem('sab_admin_token');
        localStorage.removeItem('sab_admin_user');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// Products endpoints
export const productsApi = {
  getAll: (params) => api.get('/products', { params }),
  getFeatured: () => api.get('/products/featured'),
  getById: (id) => api.get(`/products/${id}`),
  getRelated: (id) => api.get(`/products/${id}/related`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// Categories endpoints
export const categoriesApi = {
  getAll: (params) => api.get('/categories', { params }),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Enquiries endpoints
export const enquiriesApi = {
  create: (data) => api.post('/enquiries', data),
  getAll: (params) => api.get('/enquiries', { params }),
  getById: (id) => api.get(`/enquiries/${id}`),
  updateStatus: (id, data) => api.put(`/enquiries/${id}`, data),
  delete: (id) => api.delete(`/enquiries/${id}`),
};

// Programs & Events endpoints
export const programsApi = {
  getAll: (params) => api.get('/programs', { params }),
  getById: (id) => api.get(`/programs/${id}`),
  create: (data) => api.post('/programs', data),
  update: (id, data) => api.put(`/programs/${id}`, data),
  delete: (id) => api.delete(`/programs/${id}`),
};

// Stats endpoints
export const statsApi = {
  getDashboard: () => api.get('/stats/dashboard'),
};

// Upload endpoint
export const uploadApi = {
  uploadSingle: (formData) => api.post('/upload/single', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  uploadMultiple: (formData) => api.post('/upload/multiple', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export default api;
