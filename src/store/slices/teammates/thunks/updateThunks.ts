
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Teammate } from '@/types/teammate';

// Update a single teammate
export const updateTeammate = createAsyncThunk(
  'teammates/updateTeammate',
  async ({ teammateId, updates }: { teammateId: string; updates: Partial<Teammate> }, { rejectWithValue }) => {
    try {
      console.log(`Updating teammate with ID: ${teammateId}`, updates);
      // In a real implementation, this would call an API
      return { id: teammateId, ...updates };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update teammate');
    }
  }
);

// Update roles for multiple teammates
export const updateTeammatesRole = createAsyncThunk(
  'teammates/updateTeammatesRole',
  async ({ teammateIds, role }: { teammateIds: string[]; role: string }, { rejectWithValue }) => {
    try {
      console.log(`Updating role to ${role} for teammates:`, teammateIds);
      // In a real implementation, this would call an API
      return { teammateIds, role, success: true };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update teammates role');
    }
  }
);

// Update permissions for a teammate
export const updateTeammatePermissions = createAsyncThunk(
  'teammates/updateTeammatePermissions',
  async ({ teammateId, permissions }: { teammateId: string; permissions: string[] }, { rejectWithValue }) => {
    try {
      console.log(`Updating permissions for teammate ${teammateId}:`, permissions);
      // In a real implementation, this would call an API
      return { teammateId, permissions, success: true };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update teammate permissions');
    }
  }
);
