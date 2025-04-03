
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Permissions } from './types';

export const getUserPermission = createAsyncThunk<Permissions, void>(
  'auth/getUserPermission',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call for now - replace with actual API call
      const response = await fetch('/api/user/permissions');
      
      if (!response.ok) {
        throw new Error('Failed to fetch user permissions');
      }
      
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch user permissions');
    }
  }
);
