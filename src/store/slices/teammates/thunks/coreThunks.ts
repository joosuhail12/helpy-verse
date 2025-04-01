
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Teammate } from '@/types/teammate';
import { mockTeammates } from '../mockData';

// Fetch all teammates
export const fetchTeammates = createAsyncThunk(
  'teammates/fetchTeammates',
  async (_, { rejectWithValue }) => {
    try {
      // Mock API call - in a real app, this would call your backend API
      console.log('Fetching all teammates');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockTeammates;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch teammates');
    }
  }
);

// Fetch single teammate details
export const fetchTeammateDetails = createAsyncThunk(
  'teammates/fetchTeammateDetails',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      console.log(`Fetching details for teammate ${teammateId}`);
      
      // Find teammate in mock data
      const teammate = mockTeammates.find(t => t.id === teammateId);
      
      if (!teammate) {
        throw new Error('Teammate not found');
      }
      
      return teammate;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch teammate details');
    }
  }
);

// Update teammate
export const updateTeammate = createAsyncThunk(
  'teammates/updateTeammate',
  async (teammate: Teammate, { rejectWithValue }) => {
    try {
      console.log(`Updating teammate ${teammate.id}`, teammate);
      
      // In a real app, you would call your API here
      
      return teammate;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update teammate');
    }
  }
);

// Update teammates' role
export const updateTeammatesRole = createAsyncThunk(
  'teammates/updateTeammatesRole',
  async ({ teammateIds, role }: { teammateIds: string[], role: string }, { rejectWithValue }) => {
    try {
      console.log(`Updating ${teammateIds.length} teammates to role: ${role}`);
      
      // In a real app, you would call your API here
      
      return { teammateIds, role };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update teammates role');
    }
  }
);

// Update teammate permissions
export const updateTeammatePermissions = createAsyncThunk(
  'teammates/updateTeammatePermissions',
  async ({ id, permissions }: { id: string, permissions: string[] }, { rejectWithValue }) => {
    try {
      console.log(`Updating permissions for teammate ${id}`, permissions);
      
      // In a real app, you would call your API here
      
      return { id, permissions };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update teammate permissions');
    }
  }
);
