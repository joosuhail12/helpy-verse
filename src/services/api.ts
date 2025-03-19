import { HttpClient, cookieFunctions } from '@/api/services/http';

// Re-export the main API client for direct usage
const api = HttpClient.apiClient;

// Configure the API client on import
const setupApi = () => {
  const token = cookieFunctions.getCookie('customerToken') || localStorage.getItem('token');
  if (token) {
    // Use the HttpClient's method to set the token to avoid duplicating logic
    HttpClient.setAxiosDefaultConfig(token);
    console.log('API service initialized with auth token:', !!token);
  } else {
    console.log('API service initialized without auth token');
  }
};

// Initialize on import
setupApi();

export default api;
