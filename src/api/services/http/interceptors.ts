
import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { get } from 'lodash';
import { getCookie, handleLogout } from './cookieManager';

// Request Interceptor - Adds Token & Workspace ID to all requests
export const requestInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Always get fresh token for each request from cookie directly
    const token = getCookie("customerToken");
    
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
    if (error.code === 'ERR_NETWORK') {
        console.log('Network error detected - server might be unavailable');
        // Don't log out on network errors, just report the issue
        return Promise.reject(new Error("Cannot connect to the server. Please check your network connection or try again later."));
    }

    // Handle authentication errors
    if (status === 401 || errorCode === "UNAUTHORIZED") {
        console.warn("Authentication error detected, logging out");
        // Use our internal logout function
        handleLogout();
        return Promise.reject(new Error("Authentication failed. Please log in again."));
    }

    // For server errors, provide a clearer message
    if (status >= 500) {
        return Promise.reject(new Error("Server error. Please try again later."));
    }

    return Promise.reject(error);
};
