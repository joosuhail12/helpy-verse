
import { HttpClient } from '@/api/services/http';
import { ErrorHandlerService } from '@/utils/error/errorHandlerService';
import { toast } from '@/components/ui/use-toast';

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
      console.warn('API service initialized without workspace ID - API requests may fail');
    }
    
    // Connection status check
    window.addEventListener('online', () => {
      toast({
        title: 'Connection Restored',
        description: 'Your internet connection has been restored.',
      });
    });
    
    window.addEventListener('offline', () => {
      toast({
        title: 'Connection Lost',
        description: 'You are currently offline. Some features may be unavailable.',
        variant: 'destructive',
      });
    });
    
  } catch (error) {
    console.error('Error setting up API client:', error);
  }
};

/**
 * Function to retry failed requests with exponential backoff
 * Uses the centralized ErrorHandlerService
 */
const retryRequest = async <T>(
  requestFn: () => Promise<T>, 
  maxRetries = 2,
  baseDelay = 1000
): Promise<T> => {
  return ErrorHandlerService.retryWithBackoff(requestFn, maxRetries, baseDelay);
};

/**
 * API request wrapper for consistent error handling
 */
const safeRequest = async <T>(requestFn: () => Promise<T>): Promise<T> => {
  try {
    return await requestFn();
  } catch (error) {
    // Use the centralized error handler
    throw ErrorHandlerService.handleApiError(error);
  }
};

// Initialize on import
setupApi();

export { retryRequest, safeRequest };
export default api;
