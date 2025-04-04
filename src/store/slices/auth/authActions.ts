
import { createAsyncThunk } from '@reduxjs/toolkit';
import { HttpClient } from '@/api/services/http';
import { 
  Credentials,
  RegistrationCredentials,
  AuthResponse, 
  PasswordResetRequest,
  PasswordResetConfirmation
} from './types';
import { AuthService } from '@/services/authService';
import { WorkspaceService } from '@/services/workspaceService';

// Login action
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: Credentials, { rejectWithValue }) => {
    try {
      console.log('Attempting login with:', credentials.email);
      
      if (!credentials.email || !credentials.email.trim()) {
        return rejectWithValue({ message: 'Email is required' });
      }
      
      if (!credentials.password || !credentials.password.trim()) {
        return rejectWithValue({ message: 'Password is required' });
      }
      
      // Ensure clean data by trimming whitespace
      const cleanCredentials = {
        email: credentials.email.trim(),
        password: credentials.password.trim()
      };
      
      const response = await HttpClient.apiClient.post<AuthResponse>(
        '/auth/login', 
        cleanCredentials
      );
      
      if (!response.data?.data?.accessToken?.token) {
        console.error('Login response missing token:', response.data);
        return rejectWithValue({ message: 'Invalid response from server' });
      }
      
      const { data } = response.data;
      
      // Set auth token in centralized service
      AuthService.setAuthToken(data.accessToken.token);
      
      // Set user ID in auth service
      if (data.id) {
        AuthService.setUserId(data.id);
      }
      
      // Set role if available
      if (data.role) {
        AuthService.setUserRole(data.role);
      }
      
      // Set workspace ID if available
      if (data.defaultWorkspaceId) {
        WorkspaceService.setWorkspaceId(data.defaultWorkspaceId);
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Check for specific error status codes
      if (error.response?.status === 422) {
        // Validation error
        return rejectWithValue({
          message: error.response?.data?.message || 'Invalid email or password',
          code: error.response?.data?.code || 'VALIDATION_FAILED'
        });
      }
      
      // Handle network errors
      if (!navigator.onLine || error.message?.includes('Network Error')) {
        return rejectWithValue({
          message: 'Cannot connect to the server. Please check your internet connection.',
          isOfflineError: true
        });
      }
      
      return rejectWithValue(error.response?.data || { message: error.message || 'Login failed' });
    }
  }
);

// Register action
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegistrationCredentials, { rejectWithValue }) => {
    try {
      // Validate required fields
      if (!userData.email || !userData.email.trim()) {
        return rejectWithValue({ message: 'Email is required' });
      }
      
      if (!userData.password || !userData.password.trim()) {
        return rejectWithValue({ message: 'Password is required' });
      }
      
      // Clean user data
      const cleanUserData = {
        ...userData,
        email: userData.email.trim(),
        password: userData.password.trim(),
        fullName: userData.fullName?.trim(),
        companyName: userData.companyName?.trim()
      };
      
      const response = await HttpClient.apiClient.post<AuthResponse>(
        '/auth/register', 
        cleanUserData
      );
      
      if (!response.data?.data?.accessToken?.token) {
        return rejectWithValue({ message: 'Invalid response from server' });
      }
      
      const { data } = response.data;
      
      // Set auth token in centralized service
      AuthService.setAuthToken(data.accessToken.token);
      
      // Set user ID in auth service
      if (data.id) {
        AuthService.setUserId(data.id);
      }
      
      // Set workspace ID if available
      if (data.defaultWorkspaceId) {
        WorkspaceService.setWorkspaceId(data.defaultWorkspaceId);
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error);
      return rejectWithValue(error.response?.data || { message: error.message || 'Registration failed' });
    }
  }
);

// Request password reset action
export const requestPasswordReset = createAsyncThunk(
  'auth/requestReset',
  async (data: PasswordResetRequest, { rejectWithValue }) => {
    try {
      if (!data.email || !data.email.trim()) {
        return rejectWithValue({ message: 'Email is required' });
      }
      
      const cleanData = {
        email: data.email.trim()
      };
      
      const response = await HttpClient.apiClient.post(
        '/auth/password/reset/request', 
        cleanData
      );
      
      return response.data;
    } catch (error: any) {
      console.error('Password reset request error:', error);
      return rejectWithValue(error.response?.data || { message: error.message || 'Password reset request failed' });
    }
  }
);

// Confirm password reset action
export const confirmPasswordReset = createAsyncThunk(
  'auth/confirmReset',
  async (data: PasswordResetConfirmation, { rejectWithValue }) => {
    try {
      if (!data.token || !data.token.trim()) {
        return rejectWithValue({ message: 'Reset token is required' });
      }
      
      if (!data.password || !data.password.trim()) {
        return rejectWithValue({ message: 'New password is required' });
      }
      
      const cleanData = {
        token: data.token.trim(),
        password: data.password.trim(),
        confirmPassword: data.confirmPassword?.trim(),
        rid: data.rid,
        tenantId: data.tenantId
      };
      
      const response = await HttpClient.apiClient.post(
        '/auth/password/reset/confirm', 
        cleanData
      );
      
      return response.data;
    } catch (error: any) {
      console.error('Password reset confirmation error:', error);
      return rejectWithValue(error.response?.data || { message: error.message || 'Password reset failed' });
    }
  }
);

// Refresh auth token action
export const refreshAuthToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      // Only attempt refresh if we have a token
      const currentToken = AuthService.getAuthToken();
      
      if (!currentToken) {
        return rejectWithValue({
          code: 'TOKEN_MISSING',
          message: 'No token to refresh'
        });
      }
      
      // Add it to the header for this specific call
      const response = await HttpClient.apiClient.post(
        '/auth/refresh',
        {},
        {
          headers: {
            Authorization: `Bearer ${currentToken}`
          }
        }
      );
      
      if (!response.data?.data?.accessToken?.token) {
        return rejectWithValue({
          code: 'INVALID_RESPONSE',
          message: 'Invalid response from refresh endpoint'
        });
      }
      
      const { data } = response.data;
      
      // Set the new token
      AuthService.setAuthToken(data.accessToken.token);
      
      return response.data;
    } catch (error: any) {
      console.error('Token refresh error:', error);
      
      // Special handling for background refreshes
      const isBackgroundRefresh = error?.config?.headers?.['X-Background-Refresh'];
      
      if (isBackgroundRefresh) {
        return rejectWithValue({
          code: 'TOKEN_REFRESH_BACKGROUND',
          message: 'Background token refresh failed'
        });
      }
      
      return rejectWithValue(error.response?.data || { message: error.message || 'Token refresh failed' });
    }
  }
);
