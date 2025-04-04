
import { toast } from '@/components/ui/use-toast';
import { 
  ApiError,
  isAuthError, 
  isNetworkError, 
  isServerError, 
  isTimeoutError,
  isValidationError
} from './errorTypes';
import { AuthService } from '@/services/authService';

/**
 * Error handler service for consistent error handling across the application
 */
export class ErrorHandlerService {
  /**
   * Handles API errors with consistent messaging and actions
   */
  static handleApiError(error: any, showToast = true): ApiError {
    console.error('API Error:', error);
    
    let processedError: ApiError;
    
    // Process error based on type
    if (isAuthError(error)) {
      processedError = error;
      // Handle auth errors
      if (showToast) {
        toast({
          title: 'Authentication Error',
          description: error.message,
          variant: 'destructive',
        });
      }
      
      // If it's an auth error, log out user
      setTimeout(() => AuthService.logout(), 2000);
    }
    else if (isNetworkError(error)) {
      processedError = error;
      if (showToast) {
        toast({
          title: 'Connection Error',
          description: error.message,
          variant: 'destructive',
        });
      }
    }
    else if (isServerError(error)) {
      processedError = error;
      if (showToast) {
        toast({
          title: 'Server Error',
          description: error.message,
          variant: 'destructive',
        });
      }
    }
    else if (isTimeoutError(error)) {
      processedError = error;
      if (showToast) {
        toast({
          title: 'Request Timeout',
          description: error.message,
          variant: 'destructive',
        });
      }
    }
    else if (isValidationError(error)) {
      processedError = error;
      if (showToast) {
        toast({
          title: 'Validation Error',
          description: error.message,
          variant: 'destructive',
        });
      }
    }
    else {
      // Default error handling
      processedError = {
        message: error?.message || 'An unexpected error occurred. Please try again.',
        originalError: error
      };
      
      if (showToast) {
        toast({
          title: 'Error',
          description: processedError.message,
          variant: 'destructive',
        });
      }
    }
    
    return processedError;
  }
  
  /**
   * Retry a function with exponential backoff
   */
  static async retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries = 3,
    baseDelayMs = 1000,
    shouldRetry: (error: any) => boolean = (error) => 
      isNetworkError(error) || isServerError(error) || isTimeoutError(error)
  ): Promise<T> {
    let lastError;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        console.warn(`Attempt ${attempt + 1}/${maxRetries + 1} failed:`, error);
        lastError = error;
        
        // Check if we should retry
        if (attempt >= maxRetries || !shouldRetry(error)) {
          break;
        }
        
        // Calculate delay with exponential backoff and jitter
        const delay = baseDelayMs * Math.pow(2, attempt) * (0.5 + Math.random() * 0.5);
        console.log(`Retrying in ${Math.round(delay)}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw this.handleApiError(lastError, false);
  }
}
