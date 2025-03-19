
import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { get } from 'lodash';
import { getCookie, handleLogout } from './cookieManager';
import { isTokenExpired, getAuthToken } from '@/utils/auth/tokenManager';
import { store } from '@/store/store';
import { refreshToken } from '@/store/slices/auth/authActions';

// Track if we're currently refreshing to prevent multiple calls
let isRefreshing = false;
// Queue of requests to retry after token refresh
let refreshQueue: (() => void)[] = [];

// Process the refresh queue with the new token
const processRefreshQueue = () => {
  refreshQueue.forEach(callback => callback());
  refreshQueue = [];
};

// Request Interceptor - Adds Token & Workspace ID to all requests
export const requestInterceptor = async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    // Get token for each request
    const token = getAuthToken();
    
    if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
        
        // Check token expiration and refresh if needed (except for refresh/login endpoints)
        const isAuthEndpoint = config.url?.includes('auth/');
        
        if (!isAuthEndpoint && isTokenExpired() && !isRefreshing) {
            try {
                isRefreshing = true;
                console.log('Token expired, attempting refresh');
                await store.dispatch(refreshToken());
                
                // Update the token in the current request
                const newToken = getAuthToken();
                if (newToken) {
                    config.headers.set("Authorization", `Bearer ${newToken}`);
                }
                
                // Process queued requests
                processRefreshQueue();
            } catch (error) {
                console.error('Token refresh failed:', error);
                // If refresh fails, force logout
                handleLogout();
            } finally {
                isRefreshing = false;
            }
        }
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
        console.warn("Authentication error detected");
        
        // Don't logout yet if this is a token refresh attempt
        if (requestUrl && (requestUrl.includes('refresh-token') || isRefreshing)) {
            console.warn("Token refresh failed, logging out");
            handleLogout();
        } 
        // If token is expired, try to refresh
        else if (!isRefreshing && !requestUrl?.includes('auth/login')) {
            isRefreshing = true;
            
            // Create a new promise to retry the original request
            return new Promise((resolve, reject) => {
                store.dispatch(refreshToken())
                    .unwrap()
                    .then(() => {
                        // Retry the original request with new token
                        const originalRequest = error.config;
                        const newToken = getAuthToken();
                        
                        if (newToken) {
                            originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        }
                        
                        // Process any other queued requests
                        processRefreshQueue();
                        
                        // Retry the original request
                        resolve(error.response.config);
                    })
                    .catch(() => {
                        console.warn("Token refresh failed, logging out");
                        handleLogout();
                        reject(error);
                    })
                    .finally(() => {
                        isRefreshing = false;
                    });
            });
        } else {
            // Just a regular auth error during login
            return Promise.reject(new Error("Authentication failed. Please log in again."));
        }
    }

    // For server errors, provide a clearer message
    if (status >= 500) {
        return Promise.reject(new Error("Server error. Please try again later."));
    }

    return Promise.reject(error);
};
