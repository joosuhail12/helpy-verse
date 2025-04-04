
/**
 * Standard error types for consistent error handling across the application
 */

// Base error interface
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  originalError?: any;
}

// Network related errors
export interface NetworkError extends ApiError {
  isOfflineError: true;
}

// Authentication related errors
export interface AuthError extends ApiError {
  isAuthError: true;
}

// Server related errors
export interface ServerError extends ApiError {
  isServerError: true;
}

// Timeout errors
export interface TimeoutError extends ApiError {
  isTimeoutError: true;
}

// Validation errors
export interface ValidationError extends ApiError {
  isValidationError: true;
  fields?: Record<string, string>;
}

// Permission errors
export interface PermissionError extends ApiError {
  isPermissionError: true;
  requiredPermission?: string;
}

// Error factory functions
export const createNetworkError = (message: string, originalError?: any): NetworkError => ({
  message: message || 'Network connection issue. Please check your internet and try again.',
  isOfflineError: true,
  originalError
});

export const createAuthError = (message: string, originalError?: any): AuthError => ({
  message: message || 'Authentication failed. Please sign in again.',
  isAuthError: true,
  originalError
});

export const createServerError = (message: string, originalError?: any): ServerError => ({
  message: message || 'Server error. Our team has been notified.',
  isServerError: true,
  originalError
});

export const createTimeoutError = (message: string, originalError?: any): TimeoutError => ({
  message: message || 'Request timed out. Please try again.',
  isTimeoutError: true,
  originalError
});

export const createValidationError = (message: string, fields?: Record<string, string>, originalError?: any): ValidationError => ({
  message: message || 'Please check your input and try again.',
  isValidationError: true,
  fields,
  originalError
});

export const createPermissionError = (message: string, requiredPermission?: string, originalError?: any): PermissionError => ({
  message: message || 'You do not have permission to perform this action.',
  isPermissionError: true,
  requiredPermission,
  originalError
});

// Type guard functions to check error types
export const isNetworkError = (error: any): error is NetworkError => 
  error && typeof error === 'object' && 'isOfflineError' in error && error.isOfflineError === true;

export const isAuthError = (error: any): error is AuthError => 
  error && typeof error === 'object' && 'isAuthError' in error && error.isAuthError === true;

export const isServerError = (error: any): error is ServerError => 
  error && typeof error === 'object' && 'isServerError' in error && error.isServerError === true;

export const isTimeoutError = (error: any): error is TimeoutError => 
  error && typeof error === 'object' && 'isTimeoutError' in error && error.isTimeoutError === true;

export const isValidationError = (error: any): error is ValidationError => 
  error && typeof error === 'object' && 'isValidationError' in error && error.isValidationError === true;

export const isPermissionError = (error: any): error is PermissionError => 
  error && typeof error === 'object' && 'isPermissionError' in error && error.isPermissionError === true;
