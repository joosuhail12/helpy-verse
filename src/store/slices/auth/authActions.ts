import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setCookie, removeCookie } from '@/utils/helpers/helpers';
import { handleSetToken } from '@/utils/auth/tokenManager';

// Mock API for development
const mockSuccessfulLogin = (credentials) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          accessToken: 'mock-jwt-token',
          user: {
            id: '1',
            email: credentials.email,
            name: 'Test User',
            role: 'user'
          }
        }
      });
    }, 800);
  });
};

// Login action
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // For development, use mock API
      // In production, replace with your actual API endpoint
      const response = await mockSuccessfulLogin(credentials);
      const { accessToken, user } = response.data;
      
      // Set authentication token using tokenManager
      handleSetToken(accessToken);
      
      return user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Register action
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: { fullName: string; email: string; password: string; companyName: string }, { rejectWithValue }) => {
    try {
      // This would be replaced with an actual API call
      const response = await axios.post('/api/auth/register', userData);
      const { token, user } = response.data;
      
      // Set authentication token in cookie
      setCookie('customerToken', token, 7);
      
      return user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

// Request password reset
export const requestPasswordReset = createAsyncThunk(
  'auth/requestPasswordReset',
  async (data: { email: string }, { rejectWithValue }) => {
    try {
      // This would be replaced with an actual API call
      await axios.post('/api/auth/forgot-password', data);
      return true;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send reset email');
    }
  }
);

// Confirm password reset
export const confirmPasswordReset = createAsyncThunk(
  'auth/confirmPasswordReset',
  async (data: { token: string; password: string; rid?: string; tenantId?: string }, { rejectWithValue }) => {
    try {
      // This would be replaced with an actual API call
      await axios.post('/api/auth/reset-password', data);
      return true;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Password reset failed');
    }
  }
);
