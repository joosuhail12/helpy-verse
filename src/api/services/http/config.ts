
/**
 * Configuration for API endpoints
 */

// Configure API endpoints with better fallbacks
// In development mode, we'll default to localhost if not set
export const getApiBaseUrl = () => {
  if (process.env.NODE_ENV === 'development' || import.meta.env.DEV) {
    // In development, provide a clear fallback
    console.log('Running in development mode, using local API endpoint');
    return import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || 'http://localhost:4000/api';
  }
  
  // In production, check for environment variables
  return import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || '/api';
};

// Set API base URL
export const API_BASE_URL = getApiBaseUrl();
console.log('API Base URL:', API_BASE_URL);

// LLM service URL (same as API for now)
export const LLM_SERVICE_URL = API_BASE_URL;
