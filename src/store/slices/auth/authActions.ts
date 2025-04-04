
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
      console.log('Attempting login with:', credentials.email);
      
      // Ensure we're sending the right structure expected by the API
      const loginPayload = {
        email: credentials.email,
        password: credentials.password
      };
      
      // Use HttpClient instead of direct fetch
      const response = await HttpClient.apiClient.post('/auth/login', loginPayload);
      
      console.log('Login response:', response.data);
      
      // Check if response has the expected structure
      if (response.data) {
        let token = null;
        
        // Handle different response structures
        if (response.data.accessToken) {
          if (typeof response.data.accessToken === 'string') {
            token = response.data.accessToken;
          } else if (response.data.accessToken.token) {
            token = response.data.accessToken.token;
          }
        } else if (response.data.data && response.data.data.accessToken) {
          if (typeof response.data.data.accessToken === 'string') {
            token = response.data.data.accessToken;
          } else if (response.data.data.accessToken.token) {
            token = response.data.data.accessToken.token;
          }
        }
        
        if (token) {
          console.log('Token found, storing:', token.substring(0, 10) + '...');
          // Store token using tokenManager's handleSetToken
          handleSetToken(token);
        } else {
          console.warn('No token found in response:', response.data);
        }
        
        return response.data;
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Login API error:', error);
      
      // Improved error handling with more details
      let errorMessage = 'Login failed. Please check your credentials and try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
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
