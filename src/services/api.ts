
<<<<<<< HEAD
import { HttpClient, cookieFunctions } from '@/api/services/http';

// Re-export the main API client for direct usage
const api = HttpClient.apiClient;

// Configure the API client on import
const setupApi = () => {
  try {
    const token = cookieFunctions.getCookie('customerToken') || localStorage.getItem('token');
    if (token) {
      // Use the HttpClient's method to set the token to avoid duplicating logic
      HttpClient.setAxiosDefaultConfig(token);
      console.log('API service initialized with auth token:', !!token);
    } else {
      console.log('API service initialized without auth token');
    }
    
    // Ensure workspace ID is set for all requests
    const workspaceId = cookieFunctions.getCookie('workspaceId') || 
                        import.meta.env.VITE_REACT_APP_WORKSPACE_ID ||
                        'w1';
    
    if (workspaceId) {
      console.log('API service initialized with workspace ID:', workspaceId);
      // Store workspaceId in localStorage if not already there
      if (!localStorage.getItem('workspaceId')) {
        localStorage.setItem('workspaceId', workspaceId);
      }
    } else {
      console.warn('API service initialized without workspace ID');
    }
  } catch (error) {
    console.error('Error setting up API client:', error);
  }
};

// Function to retry failed requests
const retryRequest = async (requestFn: () => Promise<any>, maxRetries = 2): Promise<any> => {
  let lastError;
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      console.warn(`Request failed (attempt ${i + 1}/${maxRetries + 1}):`, error);
      lastError = error;
      
      // Wait before retrying (exponential backoff)
      if (i < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
      }
    }
  }
  throw lastError;
};

// Initialize on import
setupApi();

export { retryRequest };
=======
import axios from 'axios';
import { getCookie } from '@/utils/helpers/helpers';

// Create an axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://api.example.com',
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

>>>>>>> 11f71f9 (Fix TypeScript errors and import issues)
export default api;
