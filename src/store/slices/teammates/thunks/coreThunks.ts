
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getTeammates, getTeammateById, updateTeammateData } from '@/api/services/teammatesService';
import type { Teammate } from '@/types/teammate';

// Fetch all teammates
export const fetchTeammates = createAsyncThunk(
  'teammates/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching all teammates...');
      const teammates = await getTeammates();
      console.log(`Successfully fetched ${teammates.length} teammates`);
      return teammates;
    } catch (error: any) {
      console.error('Error fetching teammates:', error);
      return rejectWithValue(error.message || 'Failed to fetch teammates');
    }
  }
);

// Fetch specific teammate details
export const fetchTeammateDetails = createAsyncThunk(
  'teammates/fetchDetails',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      console.log(`Fetching details for teammate with ID: ${teammateId}`);
      const teammate = await getTeammateById(teammateId);
      console.log('Teammate details fetched successfully:', teammate);
      return teammate;
    } catch (error: any) {
      console.error(`Error fetching teammate details for ID ${teammateId}:`, error);
      return rejectWithValue(error.message || 'Failed to fetch teammate details');
    }
  }
);

// Update teammate information
export const updateTeammate = createAsyncThunk(
  'teammates/updateTeammate',
  async (teammate: Teammate, { rejectWithValue }) => {
    try {
      const { id } = teammate;
      if (!id) {
        throw new Error('Teammate ID is required for update');
      }
      const updated = await updateTeammateData(id, teammate);
      return updated;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update teammate');
    }
  }
);

// Add new teammate
export const addTeammate = createAsyncThunk(
  'teammates/addTeammate',
  async (newTeammate: any, { rejectWithValue }) => {
    try {
      console.log('Adding new teammate:', newTeammate);
      // Mock API response
      return {
        ...newTeammate,
        id: 'new-' + Date.now(),
        createdAt: new Date().toISOString()
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add teammate');
    }
  }
);

// Update roles for multiple teammates
export const updateTeammatesRole = createAsyncThunk(
  'teammates/updateTeammatesRole',
  async ({ teammateIds, role }: { teammateIds: string[], role: string }, { rejectWithValue }) => {
    try {
      console.log(`Updating role to ${role} for teammates:`, teammateIds);
      // Mock successful operation
      return { teammateIds, role };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update teammates role');
    }
  }
);

// Update teammate permissions
export const updateTeammatePermissions = createAsyncThunk(
  'teammates/updatePermissions',
  async ({ id, permissions }: { id: string, permissions: string[] }, { rejectWithValue }) => {
    try {
      console.log(`Updating permissions for teammate ${id}:`, permissions);
      // Mock successful operation
      return { id, permissions };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update permissions');
    }
  }
);
