
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AuthResponse } from './types';

export const fetchUserData = createAsyncThunk<AuthResponse, void>(
  'auth/fetchUserData',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call for now - replace with actual API call
      const response = await fetch('/api/user/profile');
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch user data');
    }
  }
);

export const fetchUserProfile = createAsyncThunk<AuthResponse, void>(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call for now - replace with actual API call
      const response = await fetch('/api/user/profile');
      
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }
      
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch user profile');
    }
  }
);

export const fetchWorkspaceData = createAsyncThunk<AuthResponse, string>(
  'auth/fetchWorkspaceData',
  async (workspaceId, { rejectWithValue }) => {
    try {
      // Simulate API call for now - replace with actual API call
      const response = await fetch(`/api/workspaces/${workspaceId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch workspace data');
      }
      
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch workspace data');
    }
  }
);
