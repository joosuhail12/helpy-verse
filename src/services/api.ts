
import axios from 'axios';
import { getCookie } from '@/utils/helpers/helpers';

// Create an axios instance
const api = axios.create({
  // Use the production API endpoint
  baseURL: 'https://api.pullseai.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token to request if available
    const token = getCookie('customerToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global error responses
    return Promise.reject(error);
  }
);

export default api;
