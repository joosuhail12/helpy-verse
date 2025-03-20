
// Update this file to remove the refresh token endpoint

export const API_BASE_URL = process.env.VITE_API_URL || '/api';
export const LLM_SERVICE_URL = process.env.VITE_LLM_SERVICE_URL || '/api/llm';

// Increased timeout for better reliability
export const DEFAULT_TIMEOUT = 60000; // 60 seconds (increased from 30s)
export const CONTACTS_TIMEOUT = 90000; // 90 seconds for contacts which might be larger datasets

// CORS configuration for cross-domain requests
export const CORS_CONFIG = {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  },
  withCredentials: true, // Enable credentials for cross-origin requests if needed
};

// Define all authentication endpoints in one place for consistency
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',
  USER_PROFILE: '/user/profile',
};

// For consistency, ensure the complete path includes the API_BASE_URL
// This is a helper to construct full endpoint paths
export const getFullEndpoint = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};
