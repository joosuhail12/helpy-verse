
/**
 * Configuration for API endpoints with automatic workspace_id header
 * Using localStorage only (no cookies)
 */

// Configure API base URL from environment variables
export const getApiBaseUrl = () => {
  // Default API URL
  const apiUrl = 'https://dev-socket.pullseai.com/api';
  console.log('API Base URL configured:', apiUrl);
  return apiUrl;
};

// Set API base URL
export const API_BASE_URL = getApiBaseUrl();

// LLM service URL (same as API for now)
export const LLM_SERVICE_URL = API_BASE_URL;

export const CONTACTS_TIMEOUT = 90000; // 90 seconds for contacts which might be larger datasets

// Export auth endpoints for consistency across the app
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh-token',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  USER_PROFILE: '/profile'
};

// Default timeout for API requests (in ms)
export const DEFAULT_TIMEOUT = 15000; // 15 seconds

// Maximum retries for critical API calls
export const MAX_RETRIES = 2;

// CORS configuration with dynamic workspace_id header
export const getCorsConfig = () => {
  // Get workspace ID from localStorage
  const workspaceId = localStorage.getItem('workspaceId');
  
  return {
    withCredentials: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      ...(workspaceId ? { 'workspace_id': workspaceId } : {}),
    }
  };
};

export const CORS_CONFIG = {
  // Setting withCredentials to true for CORS - may still be needed for some APIs
  withCredentials: true,
  // Add headers that may be needed for CORS preflight requests
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  }
};
