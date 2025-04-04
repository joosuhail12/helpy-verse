
import axios, { InternalAxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';

// Define HttpConfig locally since it's not exported from config
const HttpConfig = {
  DEBUG: process.env.NODE_ENV === 'development'
};

// Create a utility to check if we're in client-side code
const isClientSide = () => {
  return typeof window !== 'undefined';
};

// Add request interceptor
export const setupRequestInterceptor = (axiosInstance: typeof axios) => {
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Clone the config to avoid mutating the original
      const newConfig = { ...config };

      // Get the workspace_id from localStorage if we're in a browser
      const workspaceId = isClientSide() ? localStorage.getItem('workspaceId') : null;

      // Only add workspace_id to query params if it exists and this isn't the login request
      if (workspaceId && !newConfig.url?.includes('/auth/login')) {
        // Initialize params object if it doesn't exist
        if (!newConfig.params) {
          newConfig.params = {};
        }
        
        // Add workspace_id parameter
        newConfig.params.workspace_id = workspaceId;
        
        if (process.env.NODE_ENV === 'development' || HttpConfig.DEBUG) {
          console.log(`Request to ${newConfig.url} with workspace_id: ${workspaceId}`);
        }
      }

      // Log requests in development mode
      if (process.env.NODE_ENV === 'development' || HttpConfig.DEBUG) {
        console.log(`API Request to: ${newConfig.url} with params:`, newConfig.params);
      }

      return newConfig;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );
};

// Add response interceptor
export const setupResponseInterceptor = (axiosInstance: typeof axios) => {
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      // Log response in development mode
      if (process.env.NODE_ENV === 'development' || HttpConfig.DEBUG) {
        console.log(`API Response from ${response.config.url}:`, {
          status: response.status,
          data: response.data
        });
      }
      return response;
    },
    (error: AxiosError) => {
      // Log errors in development mode
      if (process.env.NODE_ENV === 'development' || HttpConfig.DEBUG) {
        // Fix type issues with error response
        const errorResponseData = error.response?.data as Record<string, unknown> | undefined;
        console.error(
          `API Error: ${error.response?.status} ${
            errorResponseData && typeof errorResponseData === 'object' ? String(errorResponseData.message || '') : ''
          } (${
            errorResponseData && typeof errorResponseData === 'object' ? String(errorResponseData.code || 'UNKNOWN_ERROR') : 'UNKNOWN_ERROR'
          }) on ${error.config?.url}`,
          error
        );
      }
      return Promise.reject(error);
    }
  );
};

// Setup all interceptors
export const setupInterceptors = (axiosInstance: typeof axios) => {
  setupRequestInterceptor(axiosInstance);
  setupResponseInterceptor(axiosInstance);
};
