
import { HttpClient, cookieFunctions } from '@/api/services/http';

// Get correct API URL from environment variables
const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || '/api';

// Re-export the main API client for direct usage
const api = HttpClient.apiClient;

// Configure the API client on import
const setupApi = () => {
  try {
    // Set API base URL
    console.log('Initializing API service with base URL:', API_BASE_URL);
    HttpClient.apiClient.defaults.baseURL = API_BASE_URL;
    
    // Check localStorage first for token, then cookie
    const token = localStorage.getItem('token') || cookieFunctions.getCookie('customerToken');
    if (token) {
      // Use the HttpClient's method to set the token to avoid duplicating logic
      HttpClient.setAxiosDefaultConfig(token);
      console.log('API service initialized with auth token:', !!token);
    } else {
      console.log('API service initialized without auth token');
    }
    
    // Always ensure workspace ID is set for all requests - prioritize localStorage
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
      console.warn('API service initialized without workspace ID - API requests may fail');
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
export default api;
