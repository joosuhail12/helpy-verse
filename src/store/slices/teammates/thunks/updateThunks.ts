
import { createAsyncThunk } from '@reduxjs/toolkit';
import { updateTeammateData, resendTeammateInvitation } from '@/api/services/teammatesService';
import type { Teammate } from '@/types/teammate';

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

// Update role for multiple teammates
export const updateTeammatesRole = createAsyncThunk(
  'teammates/updateTeammatesRole',
  async ({ teammateIds, role }: { teammateIds: string[], role: string }, { rejectWithValue }) => {
    try {
      // This would perform multiple API calls in a real implementation
      console.log(`Updating role to ${role} for teammates:`, teammateIds);
      
      // Mock successful operation
      return { teammateIds, role };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update teammates role');
    }
  }
);

// Resend invitation to teammate
export const resendInvitation = createAsyncThunk(
  'teammates/resendInvitation',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      await resendTeammateInvitation(teammateId);
      return teammateId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to resend invitation');
    }
  }
);

// Update teammate permissions
export const updateTeammatePermissions = createAsyncThunk(
  'teammates/updatePermissions',
  async ({ teammateId, permissions }: { teammateId: string, permissions: string[] }, { rejectWithValue }) => {
    try {
      // Mock API call
      console.log(`Updating permissions for teammate ${teammateId}:`, permissions);
      
      // Return updated permissions
      return { teammateId, permissions };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update permissions');
    }
  }
);
