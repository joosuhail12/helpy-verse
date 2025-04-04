
import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { get } from 'lodash';
import { AuthService } from '@/services/authService';
import { WorkspaceService } from '@/services/workspaceService';
import { store } from '@/store/store';
import { refreshAuthToken } from '@/store/slices/auth/authActions';
import { 
  createAuthError, 
  createNetworkError, 
  createServerError,
  createTimeoutError 
} from '@/utils/error/errorTypes';

// Request Interceptor - Adds Token & Workspace ID to all requests
export const requestInterceptor = async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    // Check for network connectivity first
    if (!navigator.onLine) {
        console.error("Network is offline - request will likely fail");
    }
    
    // Get token from our centralized auth service
    const token = AuthService.getAuthToken();
    
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

    // Get workspace_id from our centralized workspace service
    const workspaceId = WorkspaceService.getWorkspaceId();
    
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

// Token refresh functionality
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

// Subscribe to token refresh
const subscribeTokenRefresh = (cb: (token: string) => void) => {
    refreshSubscribers.push(cb);
};

// Execute subscribers with new token
const onTokenRefreshed = (newToken: string) => {
    refreshSubscribers.forEach(cb => cb(newToken));
    refreshSubscribers = [];
};

// Process queue of failed requests
const processQueue = (error: any, newToken: string | null) => {
    if (newToken) {
        onTokenRefreshed(newToken);
    } else {
        refreshSubscribers = [];
        console.error('Token refresh failed, rejecting pending requests');
    }
    return Promise.reject(error);
};

export const responseErrorInterceptor = (error: any) => {
    // Extract the meaningful error information
    const status = error.response?.status;
    const errorMessage = get(error, "response.data.message", "Unknown error occurred");
    const errorCode = get(error, "response.data.code", "");
    const requestUrl = error.config?.url;
    const timeout = error.code === 'ECONNABORTED';
    const originalRequest = error.config;

    if (timeout) {
        console.error(`API Timeout after ${error.config?.timeout || 'unknown'}ms: ${requestUrl}`);
        return Promise.reject(
            createTimeoutError(`Request timed out. The server is taking too long to respond.`, error)
        );
    }

    console.error(`API Error: ${status || 'network'} ${errorMessage} (${errorCode}) on ${requestUrl}`);

    // Network errors - provide a clearer message
    if (!navigator.onLine || error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        console.log('Network error detected - server might be unavailable');
        return Promise.reject(
            createNetworkError("Cannot connect to the server. Please check your network connection and try again later.", error)
        );
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

    // Handle token expiration - attempt refresh
    if (status === 401 && errorCode === "TOKEN_EXPIRED" && originalRequest && !originalRequest._retry) {
        if (!isRefreshing) {
            isRefreshing = true;
            originalRequest._retry = true;
            
            // Try to refresh the token
            return store.dispatch(refreshAuthToken())
                .unwrap()
                .then(response => {
                    const newToken = response?.data?.accessToken?.token;
                    if (newToken) {
                        // Update the failed request with the new token
                        AuthService.setAuthToken(newToken);
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        
                        // Process any other requests that were waiting
                        onTokenRefreshed(newToken);
                        
                        // Retry the original request
                        isRefreshing = false;
                        return fetch(originalRequest);
                    } else {
                        // If refresh didn't return a valid token
                        isRefreshing = false;
                        processQueue(error, null);
                        AuthService.logout();
                        return Promise.reject(
                            createAuthError("Session expired. Please sign in again.", error)
                        );
                    }
                })
                .catch(refreshError => {
                    isRefreshing = false;
                    processQueue(error, null);
                    AuthService.logout();
                    return Promise.reject(
                        createAuthError("Authentication failed. Please sign in again.", error)
                    );
                });
        } else {
            // If another refresh is already in progress, queue this request
            return new Promise(resolve => {
                subscribeTokenRefresh(token => {
                    // Replace the expired token and retry
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    resolve(fetch(originalRequest));
                });
            });
        }
    }
    
    // Handle other authentication errors
    if (status === 401 || errorCode === "UNAUTHORIZED") {
        console.warn("Authentication error detected, logging out");
        AuthService.logout();
        
        return Promise.reject(
            createAuthError("Authentication failed. Please sign in again.", error)
        );
    }

    // For server errors, provide a clearer message
    if (status >= 500) {
        return Promise.reject(
            createServerError("Server error. Please try again later.", error)
        );
    }

    return Promise.reject({
        message: errorMessage || "An error occurred while communicating with the server.",
        code: errorCode,
        status,
        originalError: error
    });
};
