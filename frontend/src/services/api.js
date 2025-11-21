import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://your-supabase-api.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 병원 API
export const hospitalAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.region) params.append('region', filters.region);
    if (filters.city) params.append('city', filters.city);
    if (filters.type) params.append('type', filters.type);
    if (filters.specialty) params.append('specialty', filters.specialty);
    if (filters.search) params.append('search', filters.search);
    if (filters.has_emergency_room) params.append('has_emergency_room', 'true');
    if (filters.open_24_hours) params.append('open_24_hours', 'true');
    if (filters.weekend_available) params.append('weekend_available', 'true');
    return api.get(`/hospitals?${params.toString()}`);
  },
  getById: (id) => api.get(`/hospitals/${id}`),
  getDoctors: (id) => api.get(`/hospitals/${id}/doctors`),
  getStats: () => api.get('/hospitals/stats'),
  create: (data) => api.post('/hospitals', data),
  update: (id, data) => api.put(`/hospitals/${id}`, data),
  delete: (id) => api.delete(`/hospitals/${id}`),
};

// 의사 API
export const doctorAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.specialty) params.append('specialty', filters.specialty);
    if (filters.search) params.append('search', filters.search);
    return api.get(`/doctors?${params.toString()}`);
  },
  getById: (id) => api.get(`/doctors/${id}`),
  getCurrentHospital: (id) => api.get(`/doctors/${id}/current-hospital`),
  getStats: () => api.get('/doctors/stats'),
  create: (data) => api.post('/doctors', data),
  update: (id, data) => api.put(`/doctors/${id}`, data),
  delete: (id) => api.delete(`/doctors/${id}`),
  addEducation: (id, data) => api.post(`/doctors/${id}/education`, data),
  addCareer: (id, data) => api.post(`/doctors/${id}/career`, data),
  updateCareer: (id, careerId, data) => api.put(`/doctors/${id}/career/${careerId}`, data),
  addCertification: (id, data) => api.post(`/doctors/${id}/certifications`, data),
};

// 관리자 API
export const adminAPI = {
  login: (credentials) => api.post('/admin/login', credentials),
  addDoctor: (doctorData) => api.post('/admin/doctors', doctorData),
  updateDoctor: (id, doctorData) => api.put(`/admin/doctors/${id}`, doctorData),
  deleteDoctor: (id) => api.delete(`/admin/doctors/${id}`),
};

export default api;
