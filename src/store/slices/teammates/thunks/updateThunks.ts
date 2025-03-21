
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Teammate } from '@/types/teammate';
import { updateTeammateData, resendTeammateInvitation } from '@/api/services/teammatesService';
import { TeammatesState } from '../types';

// Helper to simulate API call for mocked features that aren't implemented yet
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const updateTeammate = createAsyncThunk(
  'teammates/updateTeammate',
  async (teammate: Partial<Teammate> & { id: string }, { rejectWithValue }) => {
    try {
      const updatedTeammate = await updateTeammateData(teammate.id, teammate);
      return updatedTeammate;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update teammate');
    }
  }
);

export const updateTeammatesRole = createAsyncThunk(
  'teammates/updateTeammatesRole',
  async ({ teammateIds, role }: { teammateIds: string[], role: Teammate['role'] }, { rejectWithValue }) => {
    try {
      await delay(1000); // Simulate API call until endpoint is ready
      return { teammateIds, role };
    } catch (error: any) {
      return rejectWithValue('Failed to update roles');
    }
  }
);

export const updateTeammatePermissions = createAsyncThunk(
  'teammates/updateTeammatePermissions',
  async ({ teammateId, permissions }: { teammateId: string, permissions: string[] }) => {
    await delay(1000); // Simulate API call until endpoint is ready
    return { teammateId, permissions };
  }
);

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
