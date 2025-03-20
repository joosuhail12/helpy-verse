
import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { get } from 'lodash';
import { getCookie, handleLogout } from './cookieManager';
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
    }

    // Add workspace_id to all requests
    const workspaceId = getCookie("workspaceId");
    if (workspaceId && config.url) {
        const separator = config.url.includes("?") ? "&" : "?";
        config.url += `${separator}workspace_id=${workspaceId}`;
    }

    console.log(`API Request to: ${config.url}`);
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

    console.error(`API Error: ${status || 'network'} ${errorMessage} (${errorCode}) on ${requestUrl}`);

    // Network errors - provide a clearer message
    if (!navigator.onLine || error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        console.log('Network error detected - server might be unavailable');
        error.isOfflineError = true;
        // Don't log out on network errors, just report the issue
        return Promise.reject({
            message: "Cannot connect to the server. Please check your network connection and try again later.",
            isOfflineError: true
        });
    }

    // Handle authentication errors
    if (status === 401 || errorCode === "UNAUTHORIZED") {
        console.warn("Authentication error detected, logging out");
        handleLogout();
        
        return Promise.reject({
            message: "Authentication failed. Please sign in again.",
            isAuthError: true
        });
    }

    // For server errors, provide a clearer message
    if (status >= 500) {
        return Promise.reject({
            message: "Server error. Please try again later.",
            isServerError: true
        });
    }

    return Promise.reject(error);
};
