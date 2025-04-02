
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Permission } from './types';

// Mock permission data for development
const mockPermissions: Permission[] = [
  { action: 'read', subject: 'all' },
  { action: 'manage', subject: 'contacts' },
  { action: 'manage', subject: 'tickets' },
  { action: 'read', subject: 'reports' },
  { action: ['create', 'read', 'update'], subject: 'teammates' }
];

// Thunk to fetch user permissions
export const getUserPermission = createAsyncThunk(
  'auth/getUserPermission',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      console.log('Fetching user permissions');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockPermissions;
    } catch (error: any) {
      console.error('Error fetching user permissions:', error);
      return rejectWithValue(error.message || 'Failed to fetch user permissions');
    }
  }
);
