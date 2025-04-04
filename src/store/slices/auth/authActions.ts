
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
      
      const response = await HttpClient.apiClient.post<AuthResponse>(
        '/auth/login', 
        credentials
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
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Register action
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegistrationCredentials, { rejectWithValue }) => {
    try {
      const response = await HttpClient.apiClient.post<AuthResponse>(
        '/auth/register', 
        userData
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
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Request password reset action
export const requestPasswordReset = createAsyncThunk(
  'auth/requestReset',
  async (data: PasswordResetRequest, { rejectWithValue }) => {
    try {
      const response = await HttpClient.apiClient.post(
        '/auth/password/reset/request', 
        data
      );
      
      return response.data;
    } catch (error: any) {
      console.error('Password reset request error:', error);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Confirm password reset action
export const confirmPasswordReset = createAsyncThunk(
  'auth/confirmReset',
  async (data: PasswordResetConfirmation, { rejectWithValue }) => {
    try {
      const response = await HttpClient.apiClient.post(
        '/auth/password/reset/confirm', 
        data
      );
      
      return response.data;
    } catch (error: any) {
      console.error('Password reset confirmation error:', error);
      return rejectWithValue(error.response?.data || { message: error.message });
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
      
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);
