
/**
 * Configuration for API endpoints
 */

// Configure API base URL from environment variables
export const getApiBaseUrl = () => {
  // In production, use the VITE_API_URL or REACT_APP_API_URL environment variable
  // For development, fallback to the default from .env.development
  const apiUrl = import.meta.env.VITE_API_URL || 
                import.meta.env.REACT_APP_API_URL || 
                'http://localhost:4000/api';
  
  console.log('API Base URL configured:', apiUrl);
  return apiUrl;
};

// Set API base URL
export const API_BASE_URL = getApiBaseUrl();

// LLM service URL (same as API for now)
export const LLM_SERVICE_URL = API_BASE_URL;

// Export auth endpoints for consistency across the app
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh-token',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  USER_PROFILE: '/user/profile'
};
