
import { store } from '@/store/store';
import axios from 'axios';

// Use the environment variable for API base URL with fallback
const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || '/api';

console.log('Using API base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token and workspace ID
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    // Get token from auth state with proper type checking and optional chaining
    const token = state.auth?.user?.data?.accessToken?.token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Get workspace_id from localStorage and add to all requests
    const workspaceId = localStorage.getItem('workspaceId');
    
    if (workspaceId) {
      // Add workspace_id to params if they exist, otherwise create params
      if (!config.params) {
        config.params = {};
      }
      
      if (!config.params.workspace_id) {
        config.params.workspace_id = workspaceId;
      }
      
      console.log(`API Request to ${config.url} with workspace_id: ${workspaceId}`);
    } else {
      console.warn(`Making API request without workspace_id to: ${config.url}`);
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response from ${response.config.url}: Status ${response.status}`);
    return response;
  },
  (error) => {
    // Log detailed error information
    const status = error.response?.status;
    const url = error.config?.url;
    console.error(`API Error: ${status || 'network'} on ${url}`, error);
    
    // Handle common errors like 401 Unauthorized
    if (error.response && error.response.status === 401) {
      // Dispatch logout action
      store.dispatch({ type: 'auth/logout' });
    }
    
    return Promise.reject(error);
  }
);

export default api;
