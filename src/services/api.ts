
import { HttpClient } from '@/api/services/http';

// Get correct API URL from environment variables - default to the dev API URL
const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || 'https://dev-socket.pullseai.com/api';

// Re-export the main API client for direct usage
const api = HttpClient.apiClient;

// Configure the API client on import
const setupApi = () => {
  try {
    // Set API base URL
    console.log('Initializing API service with base URL:', API_BASE_URL);
    HttpClient.apiClient.defaults.baseURL = API_BASE_URL;
    
    // Check localStorage for token
    const token = localStorage.getItem('token');
    if (token) {
      // Use the HttpClient's method to set the token to avoid duplicating logic
      HttpClient.setAxiosDefaultConfig(token);
      console.log('API service initialized with auth token:', !!token);
    } else {
      console.log('API service initialized without auth token');
    }
    
    // Always ensure workspace ID is set for all requests
    const workspaceId = localStorage.getItem('workspaceId');
    
    if (workspaceId) {
      console.log('API service initialized with workspace ID:', workspaceId);
      
      // Set a default interceptor to include workspace_id in all requests
      HttpClient.apiClient.interceptors.request.use(config => {
        if (!config.params) {
          config.params = {};
        }
        if (!config.params.workspace_id) {
          config.params.workspace_id = workspaceId;
        }
        return config;
      });
    } else {
      console.warn('API service initialized without workspace ID - some requests may still work');
    }
    
    // Add specific error handling for auth endpoints
    HttpClient.apiClient.interceptors.response.use(
      response => response,
      error => {
        if (error.config?.url?.includes('/auth/') && error.response?.status === 404) {
          console.error('Auth endpoint not found:', error.config.url);
        }
        return Promise.reject(error);
      }
    );
  } catch (error) {
    console.error('Error setting up API client:', error);
  }
};

// Initialize on import
setupApi();

export default api;
