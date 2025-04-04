
import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
  AuthResponse, 
  Credentials, 
  RegistrationCredentials, 
  PasswordResetRequest, 
  PasswordResetConfirmation 
} from './types';
import { setAuthCookie, clearAuthCookie } from '@/utils/auth/cookieManager';

export const loginUser = createAsyncThunk<AuthResponse, Credentials>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // Simulate API call for now - replace with actual API call
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      const data = await response.json();
      
      // Store token in cookie
      if (data && data.data && data.data.accessToken && data.data.accessToken.token) {
        setAuthCookie(data.data.accessToken.token);
      }
      
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk<AuthResponse, RegistrationCredentials>(
  'auth/register',
  async (registrationData, { rejectWithValue }) => {
    try {
      // Simulate API call for now - replace with actual API call  
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData),
      });
      
      if (!response.ok) {
        throw new Error('Registration failed');
      }
      
      const data = await response.json();
      
      // Store token in cookie if available
      if (data && data.data && data.data.accessToken && data.data.accessToken.token) {
        setAuthCookie(data.data.accessToken.token);
      }
      
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const requestPasswordReset = createAsyncThunk<void, PasswordResetRequest>(
  'auth/requestPasswordReset',
  async (passwordResetRequest, { rejectWithValue }) => {
    try {
      // Simulate API call for now - replace with actual API call
      const response = await fetch('/api/auth/request-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwordResetRequest),
      });
      
      if (!response.ok) {
        throw new Error('Password reset request failed');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Password reset request failed');
    }
  }
);

export const confirmPasswordReset = createAsyncThunk<void, PasswordResetConfirmation>(
  'auth/confirmPasswordReset',
  async (passwordResetConfirmation, { rejectWithValue }) => {
    try {
      // Simulate API call for now - replace with actual API call
      const response = await fetch('/api/auth/confirm-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwordResetConfirmation),
      });
      
      if (!response.ok) {
        throw new Error('Password reset confirmation failed');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Password reset confirmation failed');
    }
  }
);
