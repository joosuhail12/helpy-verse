
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Teammate } from '@/types/teammate';
import { getTeammates, getTeammateById } from '@/api/services/teammatesService';
import { getAuthToken } from '@/utils/auth/tokenManager';

// Helper to simulate API call for mocked features that aren't implemented yet
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchTeammates = createAsyncThunk(
  'teammates/fetchTeammates',
  async (_, { rejectWithValue }) => {
    try {
      const workspaceId = localStorage.getItem('workspaceId');
      console.log('Fetching teammates with workspace ID:', workspaceId);
      
      if (!workspaceId) {
        console.error('Cannot fetch teammates: No workspace ID found');
        return rejectWithValue('No workspace ID found. Please refresh the page.');
      }
      
      // Get auth token directly from localStorage using tokenManager
      const authToken = getAuthToken();
      if (!authToken) {
        console.error('Cannot fetch teammates: No auth token found');
        return rejectWithValue('No authentication token found. Please log in again.');
      }
      
      const teammates = await getTeammates();
      console.log('Teammates API response:', teammates);
      
      // Ensure we always return an array, even if the API returned nothing
      return Array.isArray(teammates) ? teammates : [];
    } catch (error: any) {
      console.error('Failed to fetch teammates:', error);
      
      // Handle unauthorized errors specifically
      if (error.response?.status === 401 || error.response?.data?.code === 'UNAUTHORIZED') {
        return rejectWithValue('Authentication failed. Please log in again.');
      }
      
      // Provide more detailed error information
      return rejectWithValue({
        message: error.message || 'Failed to fetch teammates',
        status: error.response?.status,
        data: error.response?.data
      });
    }
  }
);

export const fetchTeammateDetails = createAsyncThunk(
  'teammates/fetchTeammateDetails',
  async (id: string, { rejectWithValue }) => {
    try {
      const workspaceId = localStorage.getItem('workspaceId');
      
      if (!workspaceId) {
        console.error('Cannot fetch teammate details: No workspace ID found');
        return rejectWithValue('No workspace ID found. Please refresh the page.');
      }
      
      // Get auth token
      const authToken = getAuthToken();
      if (!authToken) {
        console.error('Cannot fetch teammate details: No auth token found');
        return rejectWithValue('No authentication token found. Please log in again.');
      }
      
      console.log(`Fetching details for teammate ID: ${id}`);
      const teammate = await getTeammateById(id);
      console.log('Teammate details response:', teammate);
      
      if (!teammate) {
        return rejectWithValue(`Teammate with ID ${id} not found`);
      }
      
      return teammate;
    } catch (error: any) {
      console.error(`Error fetching teammate with ID ${id}:`, error);
      
      // Handle unauthorized errors specifically
      if (error.response?.status === 401) {
        return rejectWithValue('Authentication failed. Please log in again.');
      }
      
      return rejectWithValue(error.message || `Failed to fetch teammate with ID ${id}`);
    }
  }
);

export const fetchTeammateActivities = createAsyncThunk(
  'teammates/fetchTeammateActivities',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      // This is still mocked as the API isn't available yet
      await delay(1000);
      return { 
        teammateId, 
        activities: [] // Empty array since we don't have the API yet
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTeammateAssignments = createAsyncThunk(
  'teammates/fetchTeammateAssignments',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      // This is still mocked as the API isn't available yet
      await delay(1000);
      return { 
        teammateId, 
        assignments: [] // Empty array since we don't have the API yet
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTeammateSessions = createAsyncThunk(
  'teammates/fetchTeammateSessions',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      // This is still mocked as the API isn't available yet
      await delay(1000);
      return { 
        teammateId, 
        sessions: [] // Empty array since we don't have the API yet
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
