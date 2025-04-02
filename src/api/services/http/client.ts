
import axios from 'axios';
import { API_BASE_URL, LLM_SERVICE_URL, DEFAULT_TIMEOUT, CONTACTS_TIMEOUT, CORS_CONFIG } from './config';

// First, we need to define the interceptors before using them
// Request Interceptor - Adds Token & Workspace ID to all requests
const requestInterceptor = async (config) => {
    // Check for network connectivity first
    if (!navigator.onLine) {
        console.error("Network is offline - request will likely fail");
    }
    
    // Get auth token from localStorage
    const token = localStorage.getItem("token");
    
    if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
    } else {
        console.warn(`Making API request without authentication token to: ${config.url}`);
    }

    // Get workspace_id from localStorage
    const workspaceId = localStorage.getItem("workspaceId");
    
    // Always add workspace_id to all requests
    if (workspaceId) {
        // Add workspace_id to params if they exist, otherwise create params
        if (!config.params) {
            config.params = {};
        }
        
        if (!config.params.workspace_id) {
            config.params.workspace_id = workspaceId;
        }
        console.log(`Request to ${config.url} with workspace_id: ${workspaceId}`);
    } else {
        console.warn(`Making API request without workspace_id to: ${config.url}`);
    }

    console.log(`API Request to: ${config.url} with params:`, config.params);
    return config;
};

const requestErrorInterceptor = (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
};

// Response Interceptor - Handles Successful Responses and Errors
const responseInterceptor = (response) => {
    console.log(`API Response from ${response.config.url}: Status ${response.status}`);
    return response;
};

const responseErrorInterceptor = (error) => {
    // Extract the meaningful error information
    const status = error.response?.status;
    const errorMessage = error.response?.data?.message || "Unknown error occurred";
    const errorCode = error.response?.data?.code || "";
    const requestUrl = error.config?.url;
    const timeout = error.code === 'ECONNABORTED';

    if (timeout) {
        console.error(`API Timeout after ${error.config?.timeout || 'unknown'}ms: ${requestUrl}`);
        return Promise.reject({
            message: "Request timed out. The server is taking too long to respond.",
            isTimeoutError: true,
            originalError: error
        });
    }

    console.error(`API Error: ${status || 'network'} ${errorMessage} (${errorCode}) on ${requestUrl}`);

    // Network errors - provide a clearer message
    if (!navigator.onLine || error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        console.log('Network error detected - server might be unavailable');
        error.isOfflineError = true;
        // Don't log out on network errors, just report the issue
        return Promise.reject({
            message: "Cannot connect to the server. Please check your network connection and try again later.",
            isOfflineError: true,
            originalError: error
        });
    }

    // CORS errors
    if (error.message.includes('CORS')) {
        console.error('CORS error detected:', error.message);
        return Promise.reject({
            message: "There was a CORS error. This usually means the API server is not configured to accept requests from this origin.",
            isCorsError: true,
            originalError: error
        });
    }

    // Handle authentication errors
    if (status === 401 || errorCode === "UNAUTHORIZED") {
        console.warn("Authentication error detected, logging out");
        // Import the logout function to avoid circular dependencies
        const { handleLogout } = require('./cookieManager');
        handleLogout();
        
        return Promise.reject({
            message: "Authentication failed. Please sign in again.",
            isAuthError: true,
            originalError: error
        });
    }

    // For server errors, provide a clearer message
    if (status >= 500) {
        return Promise.reject({
            message: "Server error. Please try again later.",
            isServerError: true,
            originalError: error
        });
    }

    return Promise.reject({
        message: errorMessage || "An error occurred while communicating with the server.",
        originalError: error
    });
};

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
    
    // Add request and response interceptors
    client.interceptors.request.use(requestInterceptor, requestErrorInterceptor);
    client.interceptors.response.use(responseInterceptor, responseErrorInterceptor);
    
    return client;
};

// ✅ Initialize Axios instance with proper configuration
const apiClient = createApiClient(API_BASE_URL, DEFAULT_TIMEOUT);

// ✅ Create a specialized client for contacts API with longer timeout
const contactsClient = createApiClient(API_BASE_URL, CONTACTS_TIMEOUT);

// ✅ LLM Service Instance
const llmService = createApiClient(LLM_SERVICE_URL, 60000);

// ✅ Set up default axios configuration
const setAxiosDefaultConfig = (token) => {
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
export const isOffline = () => {
  return !navigator.onLine;
};

// ✅ API Call Wrapper
export const HttpClient = {
    apiClient, 
    contactsClient, 
    llmService,
    setAxiosDefaultConfig,
    isOffline,
    checkApiConnection,
};
