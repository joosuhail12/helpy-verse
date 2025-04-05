
import axios, { AxiosInstance } from 'axios';
// Import the interceptors first, before using them
import { 
  requestInterceptor, 
  requestErrorInterceptor,
  responseInterceptor, 
  responseErrorInterceptor
} from './interceptors';

// Get correct API URL from environment variables
const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || 'https://dev-socket.pullseai.com/api';

// Create the HTTP client with a single shared instance
export class HttpClient {
  static apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Create specialized client for contacts with longer timeout
  static contactsClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 45000, // Longer timeout for contact operations
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Initialize the API client with interceptors
  static {
    console.log('Initializing API client with base URL:', API_BASE_URL);
    
    // Add interceptors to main API client
    this.apiClient.interceptors.request.use(
      requestInterceptor,
      requestErrorInterceptor
    );

    this.apiClient.interceptors.response.use(
      responseInterceptor, 
      responseErrorInterceptor
    );
    
    // Add interceptors to contacts client
    this.contactsClient.interceptors.request.use(
      requestInterceptor,
      requestErrorInterceptor
    );

    this.contactsClient.interceptors.response.use(
      responseInterceptor, 
      responseErrorInterceptor
    );
  }

  // Set Axios default config with token
  static setAxiosDefaultConfig(token?: string): void {
    // If token is provided, use it; otherwise, try to get it from localStorage
    const authToken = token || localStorage.getItem('token') || '';
    
    if (authToken) {
      console.log('Authorization header set for API clients with provided token');
      this.apiClient.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      this.contactsClient.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    } else {
      console.log('No token available for API client configuration');
      delete this.apiClient.defaults.headers.common['Authorization'];
      delete this.contactsClient.defaults.headers.common['Authorization'];
    }
  }

  // Check if client is offline
  static isOffline(): boolean {
    return !navigator.onLine;
  }
  
  // Helper method to check API connection
  static async checkApiConnection(): Promise<boolean> {
    if (!navigator.onLine) {
      console.log('Device is offline, skipping API connection check');
      return false;
    }
    
    try {
      console.log('Checking API connection to', API_BASE_URL);
      
      // Try a simple profile endpoint instead of health endpoint
      await this.apiClient.get('/profile');
      console.log('API connection test successful');
      return true;
    } catch (error) {
      // Try alternative endpoint
      try {
        await this.apiClient.get('/');
        console.log('API connection successful on base endpoint');
        return true;
      } catch (secondError) {
        console.error('API connection test failed:', secondError);
        return false;
      }
    }
  }
}

// Export the HttpClient class
export default HttpClient;
