import { createAsyncThunk } from '@reduxjs/toolkit';
import { updateTeammateData, resendTeammateInvitation } from '@/api/services/teammatesService';
import type { Teammate } from '@/types/teammate';

// Helper to simulate API call for mocked features that aren't implemented yet
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const updateTeammate = createAsyncThunk(
  'teammates/updateTeammate',
  async (teammate: Teammate, { rejectWithValue }) => {
    try {
      console.log(`Updating teammate with ID: ${teammate.id}`);
      const updatedTeammate = await updateTeammateData(teammate.id, teammate);
      return updatedTeammate;
    } catch (error: any) {
      console.error(`Error updating teammate with ID ${teammate.id}:`, error);
      return rejectWithValue(error.message || `Failed to update teammate with ID ${teammate.id}`);
    }
  }
);

export const updateTeammatesRole = createAsyncThunk(
  'teammates/updateTeammatesRole',
  async ({ teamIds, role }: { teamIds: string[], role: string }, { rejectWithValue }) => {
    try {
      // This is still mocked as the API isn't available yet
      await delay(1000);
      console.log(`Setting role ${role} for teams: ${teamIds.join(', ')}`);
      return { success: true };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update team roles');
    }
  }
);

export const updateTeammatePermissions = createAsyncThunk(
  'teammates/updateTeammatePermissions',
  async ({ teammateId, permissions }: { teammateId: string, permissions: string[] }, { rejectWithValue }) => {
    try {
      // This is still mocked as the API isn't available yet
      await delay(1000);
      console.log(`Updating permissions for teammate ${teammateId}: ${permissions.join(', ')}`);
      return { teammateId, permissions, success: true };
    } catch (error: any) {
      return rejectWithValue(error.message || `Failed to update permissions for teammate ${teammateId}`);
    }
  }
);

export const resendInvitation = createAsyncThunk(
  'teammates/resendInvitation',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      await resendTeammateInvitation(teammateId);
      return { teammateId, success: true };
    } catch (error: any) {
      console.error(`Error resending invitation to teammate ${teammateId}:`, error);
      return rejectWithValue(error.message || 'Failed to resend invitation');
    }
  }
);
