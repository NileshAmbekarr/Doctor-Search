import axios from 'axios';

// Create an axios instance with the base URL
const API_URL = 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in the headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth service
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Doctor service
export const doctorService = {
  search: async (filters) => {
    const response = await api.get('/doctor/search', { params: filters });
    return response.data;
  },
  getProfile: async (id) => {
    const response = await api.get(`/doctor/${id}`);
    return response.data;
  },
  updateProfile: async (profileData) => {
    const response = await api.put('/doctor/profile', profileData);
    return response.data;
  },
  getAvailability: async (doctorId) => {
    const response = await api.get(`/doctor/${doctorId}/availability`);
    return response.data;
  },
  updateAvailability: async (availabilityData) => {
    const response = await api.put('/doctor/availability', availabilityData);
    return response.data;
  },
};

// Appointment service
export const appointmentService = {
  book: async (appointmentData) => {
    const response = await api.post('/appointment/book', appointmentData);
    return response.data;
  },
  getPatientAppointments: async () => {
    const response = await api.get('/appointment/patient');
    return response.data;
  },
  getDoctorAppointments: async () => {
    const response = await api.get('/appointment/doctor');
    return response.data;
  },
  cancelAppointment: async (appointmentId) => {
    const response = await api.put(`/appointment/${appointmentId}/cancel`);
    return response.data;
  },
};

export default api; 