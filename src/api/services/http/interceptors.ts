import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { get } from 'lodash';
import { handleLogout } from './cookieManager';
import { getAuthToken } from '@/utils/auth/tokenManager';
import { store } from '@/store/store';

// Request Interceptor - Adds Token & Workspace ID to all requests
export const requestInterceptor = async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    // Check for network connectivity first
    if (!navigator.onLine) {
        console.error("Network is offline - request will likely fail");
    }
    
    // Get token for each request
    const token = getAuthToken();
    
    if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
    } else {
        // Try getting token from Redux store as fallback
        const state = store.getState();
        const storeToken = state.auth?.user?.data?.accessToken?.token;
        
        if (storeToken) {
            config.headers.set("Authorization", `Bearer ${storeToken}`);
            console.log("Using token from Redux store");
        } else {
            console.warn(`Making API request without authentication token to: ${config.url}`);
        }
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

export const requestErrorInterceptor = (error: any) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
};

// Response Interceptor - Handles Successful Responses and Errors
export const responseInterceptor = (response: AxiosResponse) => {
    console.log(`API Response from ${response.config.url}: Status ${response.status}`);
    return response;
};

export const responseErrorInterceptor = (error: any) => {
    // Extract the meaningful error information
    const status = error.response?.status;
    const errorMessage = get(error, "response.data.message", "Unknown error occurred");
    const errorCode = get(error, "response.data.code", "");
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
