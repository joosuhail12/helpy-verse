
/**
 * Configuration for API endpoints
 */

// Configure API base URL from environment variables
export const getApiBaseUrl = () => {
  // Check for development mode
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Use local development server in development mode
  const apiUrl = isDevelopment 
    ? 'http://localhost:4000/api'
    : 'https://dev-socket.pullseai.com/api';
  
  console.log(`API Base URL configured: ${apiUrl} (${isDevelopment ? 'development' : 'production'} mode)`);
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

// Default timeout for API requests (in ms)
export const DEFAULT_TIMEOUT = 15000; // 15 seconds

// Maximum retries for critical API calls
export const MAX_RETRIES = 2;

// CORS configuration
export const CORS_CONFIG = {
  // Setting withCredentials to true to include cookies in cross-origin requests
  withCredentials: true,
  // Add headers that may be needed for CORS preflight requests
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  }
};
