
import { HttpClient } from '@/api/services/HttpClient';
import { getCookie } from '@/utils/helpers/helpers';

// Re-export the main API client for direct usage
const api = HttpClient.apiClient;

// Configure the API client on import
const setupApi = () => {
  const token = getCookie('customerToken');
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    // Make sure to properly configure all API client instances
    HttpClient.setAxiosDefaultConfig();
  }
  
  console.log('API service initialized with auth token:', !!token);
};

// Initialize on import
setupApi();

export default api;
