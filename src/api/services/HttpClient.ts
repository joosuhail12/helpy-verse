
import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { get } from "lodash";

// Configure API endpoints with better fallbacks
// In development mode, we'll default to localhost if not set
const getApiBaseUrl = () => {
  if (process.env.NODE_ENV === 'development' || import.meta.env.DEV) {
    // In development, provide a clear fallback
    console.log('Running in development mode, using local API endpoint');
    return import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || 'http://localhost:4000/api';
  }
  
  // In production, check for environment variables
  return import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || '/api';
};

// Set API base URL
const API_BASE_URL = getApiBaseUrl();
console.log('API Base URL:', API_BASE_URL);

// LLM service URL (same as API for now)
const LLM_SERVICE_URL = API_BASE_URL;

// ✅ Initialize Axios instance with proper configuration
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 30000, // 30 seconds timeout
    withCredentials: true, // Important for handling cookies across domains if needed
});

// ✅ Set up default axios configuration
const setAxiosDefaultConfig = (token?: string): void => {
    // If token is provided, use it; otherwise try to get it from cookie (imported dynamically to avoid circular dependency)
    if (token) {
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        console.log("Authorization header set for API client with provided token");
    } else {
        // We'll handle this in the request interceptor instead
        console.log("No token provided, will check in interceptor");
    }
};

// Helper function to get cookies (moved here to avoid circular dependencies)
const getCookieValue = (cname: string): string => {
    const name = `${cname}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    
    return "";
};

// ✅ Request Interceptor - Adds Token & Workspace ID to all requests
const requestInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Always get fresh token for each request from cookie directly
    const token = getCookieValue("customerToken");
    
    if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
    }

    // Add workspace_id to all requests
    const workspaceId = getCookieValue("workspaceId");
    if (workspaceId && config.url) {
        const separator = config.url.includes("?") ? "&" : "?";
        config.url += `${separator}workspace_id=${workspaceId}`;
    }

    console.log(`API Request to: ${config.url}`);
    return config;
};

const requestErrorInterceptor = (error: any) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
};

// ✅ Response Interceptor - Handles Successful Responses and Errors
const responseInterceptor = (response: AxiosResponse) => {
    console.log(`API Response from ${response.config.url}: Status ${response.status}`);
    return response;
};

const responseErrorInterceptor = (error: any) => {
    // Extract the meaningful error information
    const status = error.response?.status;
    const errorMessage = get(error, "response.data.message", "Unknown error occurred");
    const errorCode = get(error, "response.data.code", "");
    const requestUrl = error.config?.url;

    console.error(`API Error: ${status || 'network'} ${errorMessage} (${errorCode}) on ${requestUrl}`);

    // Network errors - provide a clearer message
    if (error.code === 'ERR_NETWORK') {
        console.log('Network error detected - server might be unavailable');
        // Don't log out on network errors, just report the issue
        return Promise.reject(new Error("Cannot connect to the server. Please check your network connection or try again later."));
    }

    // Handle authentication errors
    if (status === 401 || errorCode === "UNAUTHORIZED") {
        console.warn("Authentication error detected, logging out");
        // Import dynamically to avoid circular dependency
        import('../../utils/auth/tokenManager').then(({ handleLogout }) => {
            handleLogout();
        });
        return Promise.reject(new Error("Authentication failed. Please log in again."));
    }

    // For server errors, provide a clearer message
    if (status >= 500) {
        return Promise.reject(new Error("Server error. Please try again later."));
    }

    return Promise.reject(error);
};

// Add interceptors to the API client
apiClient.interceptors.request.use(requestInterceptor, requestErrorInterceptor);
apiClient.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

// ✅ LLM Service Instance
const llmService = axios.create({
    baseURL: LLM_SERVICE_URL,
    headers: { "Content-Type": "application/json" },
    timeout: 60000, // 60 second timeout for LLM operations which may take longer
    withCredentials: true,
});

// Add the same interceptors to the LLM service
llmService.interceptors.request.use(requestInterceptor, requestErrorInterceptor);
llmService.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

// ✅ API Call Wrapper
export const HttpClient = {
    apiClient, // Standard API client
    llmService, // LLM-specific instance
    setAxiosDefaultConfig,
};
