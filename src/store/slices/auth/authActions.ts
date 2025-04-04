
import { createAsyncThunk } from '@reduxjs/toolkit';
import { HttpClient } from '@/api/services/http';
import { AuthService } from '@/services/authService';
import { PasswordResetConfirmation, PasswordResetRequest, RegistrationCredentials } from './types';

// Define action types
export const LOGIN = 'auth/login';
export const LOGOUT = 'auth/logout';
export const REFRESH_TOKEN = 'auth/refreshToken';
export const REGISTER_USER = 'auth/register';
export const REQUEST_PASSWORD_RESET = 'auth/requestPasswordReset';
export const CONFIRM_PASSWORD_RESET = 'auth/confirmPasswordReset';

// Define interfaces for action payloads
interface LoginCredentials {
  email: string;
  password: string;
}

// Login action - directly handles authentication
export const loginUser = createAsyncThunk(
  LOGIN,
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      console.log('Auth action: Attempting login with email:', credentials.email);
      
      // Use a clean auth client without interceptors for login
      const authClient = HttpClient.authClient();
      
      // Log exactly what's being sent
      console.log('Auth action: Sending login request to server with payload:', {
        ...credentials,
        password: '[REDACTED]'
      });
      
      const response = await authClient.post('/auth/login', {
        email: credentials.email,
        password: credentials.password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Auth action: Login response received:', {
        status: response.status,
        success: !!response.data,
        hasToken: !!(response.data?.data?.accessToken?.token)
      });
      
      // Handle successful login
      if (response.data?.data?.accessToken?.token) {
        AuthService.setAuthToken(response.data.data.accessToken.token);
        
        // If there's user data, store it
        if (response.data.data.user) {
          AuthService.setUserId(response.data.data.user.id);
          AuthService.setUserRole(response.data.data.user.role);
          
          // Store workspace if available
          if (response.data.data.user.workspace?.id) {
            localStorage.setItem('workspaceId', response.data.data.user.workspace.id);
            console.log('Workspace ID set from login response:', response.data.data.user.workspace.id);
          }
        }
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Auth action: Login error:', error.response || error);
      
      // Enhance error message with response details if available
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      const statusCode = error.response?.status;
      
      console.log(`Auth action: Login failed with status ${statusCode}: ${errorMessage}`);
      
      return rejectWithValue({
        message: errorMessage,
        status: statusCode,
        error: error.response?.data || error.message
      });
    }
  }
);

// Register user action
export const registerUser = createAsyncThunk(
  REGISTER_USER,
  async (userData: RegistrationCredentials, { rejectWithValue }) => {
    try {
      console.log('Auth action: Attempting registration with email:', userData.email);
      
      // Use auth client without interceptors
      const authClient = HttpClient.authClient();
      
      const response = await authClient.post('/auth/register', userData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Auth action: Registration response received:', {
        status: response.status,
        success: !!response.data
      });
      
      // Handle successful registration
      if (response.data?.data?.accessToken?.token) {
        AuthService.setAuthToken(response.data.data.accessToken.token);
        
        if (response.data.data.user) {
          AuthService.setUserId(response.data.data.user.id);
          AuthService.setUserRole(response.data.data.user.role);
        }
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Auth action: Registration error:', error.response || error);
      
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      const statusCode = error.response?.status;
      
      return rejectWithValue({
        message: errorMessage,
        status: statusCode,
        error: error.response?.data || error.message
      });
    }
  }
);

// Request password reset action
export const requestPasswordReset = createAsyncThunk(
  REQUEST_PASSWORD_RESET,
  async (data: PasswordResetRequest, { rejectWithValue }) => {
    try {
      console.log('Auth action: Requesting password reset for email:', data.email);
      
      // Use auth client without interceptors
      const authClient = HttpClient.authClient();
      
      const response = await authClient.post('/auth/forgot-password', {
        email: data.email
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Auth action: Password reset request response:', {
        status: response.status,
        success: !!response.data
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Auth action: Password reset request error:', error.response || error);
      
      const errorMessage = error.response?.data?.message || error.message || 'Password reset request failed';
      
      return rejectWithValue({
        message: errorMessage,
        error: error.response?.data || error.message
      });
    }
  }
);

// Confirm password reset action
export const confirmPasswordReset = createAsyncThunk(
  CONFIRM_PASSWORD_RESET,
  async (data: PasswordResetConfirmation, { rejectWithValue }) => {
    try {
      console.log('Auth action: Confirming password reset');
      
      // Use auth client without interceptors
      const authClient = HttpClient.authClient();
      
      // Prepare the payload
      const payload = {
        token: data.token,
        password: data.password,
        confirmPassword: data.confirmPassword || data.password
      };
      
      // Add optional fields if they exist
      if (data.rid) {
        payload['rid'] = data.rid;
      }
      
      if (data.tenantId) {
        payload['tenantId'] = data.tenantId;
      }
      
      const response = await authClient.post('/auth/reset-password', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Auth action: Password reset confirmation response:', {
        status: response.status,
        success: !!response.data
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Auth action: Password reset confirmation error:', error.response || error);
      
      const errorMessage = error.response?.data?.message || error.message || 'Password reset failed';
      
      return rejectWithValue({
        message: errorMessage,
        error: error.response?.data || error.message
      });
    }
  }
);

// Refresh token action
export const refreshAuthToken = createAsyncThunk(
  REFRESH_TOKEN,
  async (_, { rejectWithValue }) => {
    try {
      // Check if we have a refresh token first
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      // Use direct API call without interceptors for token refresh
      const authClient = HttpClient.authClient();
      const response = await authClient.post('/auth/refresh', {
        refreshToken
      });
      
      // Update token in storage
      if (response.data?.data?.accessToken?.token) {
        AuthService.setAuthToken(response.data.data.accessToken.token);
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Token refresh failed:', error.response || error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
