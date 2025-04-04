
import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
  AuthResponse, 
  Credentials, 
  RegistrationCredentials, 
  PasswordResetRequest, 
  PasswordResetConfirmation 
} from './types';
import { handleSetToken } from '@/utils/auth/tokenManager';
import { HttpClient } from '@/api/services/http';

export const loginUser = createAsyncThunk<AuthResponse, Credentials>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // Use HttpClient instead of direct fetch
      const response = await HttpClient.apiClient.post('/auth/login', credentials);
      
      // Check if response has the expected structure
      if (response.data && response.data.accessToken) {
        // Store token using tokenManager's handleSetToken
        handleSetToken(response.data.accessToken.token || response.data.accessToken);
        return response.data;
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Login API error:', error);
      
      // Improved error handling with more details
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Login failed. Please check your credentials and try again.';
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const registerUser = createAsyncThunk<AuthResponse, RegistrationCredentials>(
  'auth/register',
  async (registrationData, { rejectWithValue }) => {
    try {
      // Use HttpClient instead of direct fetch
      const response = await HttpClient.apiClient.post('/auth/register', registrationData);
      
      // Check if response has the expected structure
      if (response.data && response.data.accessToken) {
        // Store token using tokenManager's handleSetToken
        handleSetToken(response.data.accessToken.token || response.data.accessToken);
        return response.data;
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Registration API error:', error);
      
      // Improved error handling
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Registration failed. Please try again.';
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const requestPasswordReset = createAsyncThunk<void, PasswordResetRequest>(
  'auth/requestPasswordReset',
  async (passwordResetRequest, { rejectWithValue }) => {
    try {
      // Use HttpClient instead of direct fetch
      await HttpClient.apiClient.post('/auth/reset-password-request', passwordResetRequest);
    } catch (error: any) {
      console.error('Password reset request API error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Password reset request failed. Please try again.';
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const confirmPasswordReset = createAsyncThunk<void, PasswordResetConfirmation>(
  'auth/confirmPasswordReset',
  async (passwordResetConfirmation, { rejectWithValue }) => {
    try {
      // Use HttpClient instead of direct fetch
      await HttpClient.apiClient.post('/auth/reset-password-confirm', passwordResetConfirmation);
    } catch (error: any) {
      console.error('Password reset confirmation API error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Password reset confirmation failed. Please try again.';
      
      return rejectWithValue(errorMessage);
    }
  }
);
