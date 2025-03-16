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

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response || error);
    return Promise.reject(error);
  }
);

// Auth service
export const authService = {
  login: async (credentials) => {
    try {
      console.log('API login request with credentials:', credentials);
      const response = await api.post('/auth/login', credentials);
      console.log('API login response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API login error:', error.response?.data || error.message);
      throw error;
    }
  },
  register: async (userData) => {
    try {
      console.log('API register request with data:', userData);
      const response = await api.post('/auth/register', userData);
      console.log('API register response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API register error:', error.response?.data || error.message);
      throw error;
    }
  },
  getCurrentUser: async () => {
    try {
      console.log('API getCurrentUser request');
      const response = await api.get('/auth/me');
      console.log('API getCurrentUser response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API getCurrentUser error:', error.response?.data || error.message);
      throw error;
    }
  },
};

// Doctor service
export const doctorService = {
  search: async (filters) => {
    // Transform the filters to match the server's expected parameter names
    const queryParams = {
      specialty: filters.specialty || '',
      name: filters.search || '',
    };
    
    // If location is provided, try to parse it as city
    if (filters.location) {
      queryParams.city = filters.location;
    }
    
    const response = await api.get('/doctor/search', { params: queryParams });
    return response.data;
  },
  getProfile: async (id) => {
    console.log(`Fetching doctor profile with ID: ${id}`);
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
    const response = await api.post('/appointment', appointmentData);
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