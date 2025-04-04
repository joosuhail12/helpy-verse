
import { store } from '@/store/store';
import { HttpClient } from '@/api/services/http';

// IMPORTANT: We're using the centralized HttpClient now instead of creating a new one
console.log('Using API client from HttpClient');

// Re-export the HttpClient's apiClient as 'api' for backward compatibility
const api = HttpClient.apiClient;

// Export the default api client
export default api;
