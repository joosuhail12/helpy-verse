
import { getWorkspaceId, handleLogout, getCookie, getAuthToken } from "@/utils/helpers/helpers";
import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { get } from "lodash";

// Configure API endpoints
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? import.meta.env.REACT_APP_API_URL || 'http://localhost:4000/api'
  : import.meta.env.REACT_APP_API_URL || 'http://localhost:4000/api';

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
export const setAxiosDefaultConfig = (): void => {
    const token = getAuthToken();
    console.log("Setting Axios default config with token:", !!token);

    // Set the Authorization header if token exists
    if (token) {
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        console.log("Authorization header set for API client");
    } else {
        // Clear the Authorization header if no token
        delete apiClient.defaults.headers.common["Authorization"];
        console.log("No token found, Authorization header removed");
    }
};

// ✅ Request Interceptor - Adds Token & Workspace ID to all requests
const requestInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Always get fresh token for each request
    const token = getAuthToken();
    
    if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
    }

    // Add workspace_id to all requests
    const workspaceId = getWorkspaceId();
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

    // Handle authentication errors
    if (status === 401 || errorCode === "UNAUTHORIZED") {
        console.warn("Authentication error detected, logging out");
        handleLogout();
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

// Initialize the default config
setAxiosDefaultConfig();

// ✅ API Call Wrapper
export const HttpClient = {
    apiClient, // Standard API client
    llmService, // LLM-specific instance
    setAxiosDefaultConfig,
};
