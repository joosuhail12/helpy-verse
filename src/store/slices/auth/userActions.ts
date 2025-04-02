
import { createAsyncThunk } from '@reduxjs/toolkit';
import { HttpClient } from '@/api/services/http';
import { setWorkspaceId } from '@/api/services/http/cookieManager';
import { AuthResponse, ResponseStatus } from './types';

// Thunk to fetch user data
export const fetchUserData = createAsyncThunk(
  'auth/fetchUserData',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call for now
      // In real app, this would be: const response = await HttpClient.apiClient.get('/auth/me');
      console.log('Fetching user data');
      
      // Mock successful response for development
      const userData: AuthResponse = {
        status: "success" as ResponseStatus,
        message: "User data retrieved successfully",
        data: {
          id: 'user-123',
          name: 'Test User',
          email: 'test@example.com',
          workspaceId: 'workspace-123',
          role: 'admin',
          accessToken: {
            token: "mock-token",
            expiry: Date.now() + 3600000,
            issuedAt: new Date().toISOString(),
            userAgent: navigator.userAgent,
            ip: "127.0.0.1"
          },
          defaultWorkspaceId: 'workspace-123'
        }
      };
      
      // Store workspace ID in localStorage for easy access in API calls
      if (userData.data.workspaceId) {
        setWorkspaceId(userData.data.workspaceId);
      }
      
      return userData;
    } catch (error: any) {
      console.error('Error fetching user data:', error);
      return rejectWithValue(error.message || 'Failed to fetch user data');
    }
  }
);

// Thunk to fetch user profile data
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call for now
      console.log('Fetching user profile');
      
      // Mock successful response for development
      return {
        status: "success" as ResponseStatus,
        message: "User profile retrieved successfully",
        data: {
          id: 'user-123',
          name: 'Test User',
          email: 'test@example.com',
          avatar: 'https://ui-avatars.com/api/?name=Test+User',
          role: 'admin',
          department: 'Engineering',
          lastLogin: new Date().toISOString(),
          accessToken: {
            token: "mock-token",
            expiry: Date.now() + 3600000,
            issuedAt: new Date().toISOString(),
            userAgent: navigator.userAgent,
            ip: "127.0.0.1"
          },
          defaultWorkspaceId: 'workspace-123'
        }
      };
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      return rejectWithValue(error.message || 'Failed to fetch user profile');
    }
  }
);

// Thunk to fetch workspace data
export const fetchWorkspaceData = createAsyncThunk(
  'auth/fetchWorkspaceData',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call for now
      console.log('Fetching workspace data');
      
      // Mock successful response for development
      return {
        status: "success" as ResponseStatus,
        message: "Workspace data retrieved successfully",
        data: {
          id: 'workspace-123',
          name: 'Test Workspace',
          plan: 'professional',
          seats: 10,
          usedSeats: 3,
          createdAt: new Date().toISOString(),
          accessToken: {
            token: "mock-token",
            expiry: Date.now() + 3600000,
            issuedAt: new Date().toISOString(),
            userAgent: navigator.userAgent,
            ip: "127.0.0.1"
          },
          defaultWorkspaceId: 'workspace-123'
        }
      };
    } catch (error: any) {
      console.error('Error fetching workspace data:', error);
      return rejectWithValue(error.message || 'Failed to fetch workspace data');
    }
  }
);
