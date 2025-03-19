
import axios from 'axios';
import { API_BASE_URL, LLM_SERVICE_URL, DEFAULT_TIMEOUT, CORS_CONFIG } from './config';
import { 
  requestInterceptor, 
  requestErrorInterceptor, 
  responseInterceptor, 
  responseErrorInterceptor 
} from './interceptors';
import { cookieFunctions } from './cookieManager';

// ✅ Initialize Axios instance with proper configuration
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      ...CORS_CONFIG.headers
    },
    timeout: DEFAULT_TIMEOUT,
    withCredentials: CORS_CONFIG.withCredentials, // Important for handling cookies across domains if needed
});

// ✅ Set up default axios configuration
const setAxiosDefaultConfig = (token?: string): void => {
    // If token is provided, use it; otherwise try to get it from cookie
    if (token) {
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        console.log("Authorization header set for API client with provided token");
    } else {
        // We'll handle this in the request interceptor instead
        console.log("No token provided, will check in interceptor");
    }
};

// Add interceptors to the API client
apiClient.interceptors.request.use(requestInterceptor, requestErrorInterceptor);
apiClient.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

// ✅ LLM Service Instance
const llmService = axios.create({
    baseURL: LLM_SERVICE_URL,
    headers: { 
      "Content-Type": "application/json",
      ...CORS_CONFIG.headers
    },
    timeout: 60000, // 60 second timeout for LLM operations which may take longer
    withCredentials: CORS_CONFIG.withCredentials,
});

// Add the same interceptors to the LLM service
llmService.interceptors.request.use(requestInterceptor, requestErrorInterceptor);
llmService.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

// Offline check utility
export const isOffline = (): boolean => {
  return !navigator.onLine;
};

// ✅ API Call Wrapper
export const HttpClient = {
    apiClient, // Standard API client
    llmService, // LLM-specific instance
    setAxiosDefaultConfig,
    isOffline,
};
