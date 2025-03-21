
import { store } from '@/store/store';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

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
    } else {
      console.warn('Making API request without workspace_id', config.url);
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors like 401 Unauthorized
    if (error.response && error.response.status === 401) {
      // Dispatch logout action
      store.dispatch({ type: 'auth/logout' });
    }
    
    return Promise.reject(error);
  }
);

export default api;
