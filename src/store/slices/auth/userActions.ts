
import { createAsyncThunk } from '@reduxjs/toolkit';
import { HttpClient } from '@/api/services/http';
import { setWorkspaceId } from '@/api/services/http/cookieManager';

// Thunk to fetch user data
export const fetchUserData = createAsyncThunk(
  'auth/fetchUserData',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call for now
      // In real app, this would be: const response = await HttpClient.apiClient.get('/auth/me');
      console.log('Fetching user data');
      
      // Mock successful response for development
      const mockData = {
        id: 'user-123',
        name: 'Test User',
        email: 'test@example.com',
        workspaceId: 'workspace-123',
        role: 'admin'
      };
      
      // Store workspace ID in localStorage for easy access in API calls
      if (mockData.workspaceId) {
        setWorkspaceId(mockData.workspaceId);
      }
      
      return mockData;
    } catch (error) {
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
        id: 'user-123',
        name: 'Test User',
        email: 'test@example.com',
        avatar: 'https://ui-avatars.com/api/?name=Test+User',
        role: 'admin',
        department: 'Engineering',
        lastLogin: new Date().toISOString()
      };
    } catch (error) {
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
        id: 'workspace-123',
        name: 'Test Workspace',
        plan: 'professional',
        seats: 10,
        usedSeats: 3,
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching workspace data:', error);
      return rejectWithValue(error.message || 'Failed to fetch workspace data');
    }
  }
);
