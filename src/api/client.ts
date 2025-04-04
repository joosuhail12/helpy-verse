
import api from './Api';
import { store } from '@/store/store';

// Standard response interface
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

// Error response structure
export interface ApiError {
  message: string;
  status?: number;
  details?: any;
}

// Request options interface
export interface RequestOptions {
  params?: Record<string, any>;
  headers?: Record<string, any>;
  withCredentials?: boolean;
  timeout?: number;
}

/**
 * Base API client with standardized methods for API operations
 */
class ApiClient {
  /**
   * Make a GET request
   */
  async get<T = any>(url: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    try {
      const response = await api.get(url, { 
        params: options.params,
        headers: options.headers,
        withCredentials: options.withCredentials,
        timeout: options.timeout
      });
      return { data: response.data, status: response.status };
    } catch (error: any) {
      this.handleApiError(error);
    }
  }

  /**
   * Make a POST request
   */
  async post<T = any>(url: string, data: any, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    try {
      const response = await api.post(url, data, {
        params: options.params,
        headers: options.headers,
        withCredentials: options.withCredentials,
        timeout: options.timeout
      });
      return { data: response.data, status: response.status };
    } catch (error: any) {
      this.handleApiError(error);
    }
  }

  /**
   * Make a PUT request
   */
  async put<T = any>(url: string, data: any, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    try {
      const response = await api.put(url, data, {
        params: options.params,
        headers: options.headers,
        withCredentials: options.withCredentials,
        timeout: options.timeout
      });
      return { data: response.data, status: response.status };
    } catch (error: any) {
      this.handleApiError(error);
    }
  }

  /**
   * Make a DELETE request
   */
  async delete<T = any>(url: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    try {
      const response = await api.delete(url, {
        params: options.params,
        headers: options.headers,
        withCredentials: options.withCredentials,
        timeout: options.timeout
      });
      return { data: response.data, status: response.status };
    } catch (error: any) {
      this.handleApiError(error);
    }
  }

  /**
   * Make a PATCH request
   */
  async patch<T = any>(url: string, data: any, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    try {
      const response = await api.patch(url, data, {
        params: options.params,
        headers: options.headers,
        withCredentials: options.withCredentials,
        timeout: options.timeout
      });
      return { data: response.data, status: response.status };
    } catch (error: any) {
      this.handleApiError(error);
    }
  }

  /**
   * Standardized error handling
   */
  private handleApiError(error: any): never {
    // Format error for consistent handling across the application
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'Unknown error occurred',
      status: error.response?.status,
      details: error.response?.data
    };

    // Log error for debugging
    console.error('API Error:', apiError);

    // Handle specific error codes
    if (error.response?.status === 401) {
      // Dispatch logout action for authentication errors
      store.dispatch({ type: 'auth/logout' });
      apiError.message = 'Your session has expired. Please log in again.';
    }

    throw apiError;
  }

  /**
   * Check API health
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await api.get('/health', { timeout: 5000 });
      return response.status === 200;
    } catch (error) {
      console.warn('API health check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
