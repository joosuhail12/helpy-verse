
/**
 * Configuration for API endpoints
 */

// Configure API endpoints
export const getApiBaseUrl = () => {
  // In production, check for environment variables
  return import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || '/api';
};

// Set API base URL
export const API_BASE_URL = getApiBaseUrl();
console.log('API Base URL:', API_BASE_URL);

// LLM service URL (same as API for now)
export const LLM_SERVICE_URL = API_BASE_URL;
