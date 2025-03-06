import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Replace with your actual API URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
};

export const doctorService = {
  search: async (filters: any) => {
    const response = await api.get('/doctor/search', { params: filters });
    return response.data;
  },
  getProfile: async (id: string) => {
    const response = await api.get(`/doctor/profile/${id}`);
    return response.data;
  },
  updateProfile: async (id: string, data: any) => {
    const response = await api.post(`/doctor/profile/${id}`, data);
    return response.data;
  },
};

export const appointmentService = {
  book: async (data: any) => {
    const response = await api.post('/appointment', data);
    return response.data;
  },
  getAppointments: async () => {
    const response = await api.get('/appointment');
    return response.data;
  },
  cancel: async (id: string) => {
    const response = await api.delete(`/appointment/${id}`);
    return response.data;
  },
};

export default api;