
import axios from 'axios';
import { API_BASE_URL, LLM_SERVICE_URL, DEFAULT_TIMEOUT, CONTACTS_TIMEOUT, CORS_CONFIG } from './config';
import { cookieFunctions } from './cookieManager';

// A function to create an axios instance with proper config
const createApiClient = (baseURL, timeout) => {
    const client = axios.create({
        baseURL,
        headers: {
            "Content-Type": "application/json",
            ...CORS_CONFIG.headers
        },
        timeout,
        withCredentials: CORS_CONFIG.withCredentials,
    });
    
    return client;
};

// ✅ Initialize Axios instance with proper configuration
const apiClient = createApiClient(API_BASE_URL, DEFAULT_TIMEOUT);

// ✅ Create a specialized client for contacts API with longer timeout
const contactsClient = createApiClient(API_BASE_URL, CONTACTS_TIMEOUT);

// ✅ LLM Service Instance
const llmService = createApiClient(LLM_SERVICE_URL, 60000);

// ✅ Set up default axios configuration
const setAxiosDefaultConfig = (token?: string): void => {
    // If token is provided, use it; otherwise try to get it from cookie
    if (token) {
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        contactsClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        llmService.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        console.log("Authorization header set for API clients with provided token");
    } else {
        // We'll handle this in the request interceptor instead
        console.log("No token provided, will check in interceptor");
    }
};

// Debug function to check API connectivity
const checkApiConnection = async () => {
    try {
        console.log(`Checking API connection to ${API_BASE_URL}`);
        // First try the health endpoint
        const response = await apiClient.get('/health', { timeout: 5000 })
          .catch(() => {
            // If health endpoint fails, try a simple GET to the base URL
            return apiClient.get('/', { timeout: 5000 });
          });
        console.log('API connection check result:', response.status);
        return true;
    } catch (error) {
        console.error('API connection check failed:', error.message);
        return false;
    }
};

// Offline check utility
export const isOffline = (): boolean => {
  return !navigator.onLine;
};

// ✅ Export the HttpClient without attaching interceptors yet
export const HttpClient = {
    apiClient, 
    contactsClient, 
    llmService,
    setAxiosDefaultConfig,
    isOffline,
    checkApiConnection,
};

// Import and attach interceptors after client is created to avoid circular dependency
import { 
  requestInterceptor, 
  requestErrorInterceptor, 
  responseInterceptor, 
  responseErrorInterceptor 
} from './interceptors';

// Now attach interceptors to the clients
apiClient.interceptors.request.use(requestInterceptor, requestErrorInterceptor);
apiClient.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

contactsClient.interceptors.request.use(requestInterceptor, requestErrorInterceptor);
contactsClient.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

llmService.interceptors.request.use(requestInterceptor, requestErrorInterceptor);
llmService.interceptors.response.use(responseInterceptor, responseErrorInterceptor);
