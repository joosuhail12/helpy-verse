
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
    
    // Always ensure workspace ID is set for all requests - prioritize localStorage
    const workspaceId = localStorage.getItem('workspaceId') || cookieFunctions.getCookie('workspaceId');
    
    if (workspaceId) {
      console.log('API service initialized with workspace ID:', workspaceId);
      // Ensure it's also in localStorage for consistency
      if (!localStorage.getItem('workspaceId')) {
        localStorage.setItem('workspaceId', workspaceId);
        console.log('Synced workspace ID to localStorage');
      }
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
