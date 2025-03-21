
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Teammate } from '@/types/teammate';
import { 
  getTeammates,
  getTeammateById,
  createTeammate, 
  updateTeammateData,
  resendTeammateInvitation
} from '@/api/services/teammatesService';
import { TeammatesState } from './types';

// Helper to simulate API call for mocked features that aren't implemented yet
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchTeammates = createAsyncThunk(
  'teammates/fetchTeammates',
  async (_, { rejectWithValue }) => {
    try {
      const teammates = await getTeammates();
      return teammates;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch teammates');
    }
  }
);

export const fetchTeammateDetails = createAsyncThunk(
  'teammates/fetchTeammateDetails',
  async (id: string, { rejectWithValue }) => {
    try {
      const teammate = await getTeammateById(id);
      return teammate;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch teammate details');
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

export const enable2FA = createAsyncThunk(
  'teammates/enable2FA',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      // This is still mocked as the API isn't available yet
      await delay(1000);
      return { teammateId, setupKey: 'MOCK-2FA-SETUP-KEY' };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const verify2FA = createAsyncThunk(
  'teammates/verify2FA',
  async ({ teammateId, code }: { teammateId: string; code: string }, { rejectWithValue }) => {
    try {
      // This is still mocked as the API isn't available yet
      await delay(1000);
      return { teammateId, success: true };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const disable2FA = createAsyncThunk(
  'teammates/disable2FA',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      // This is still mocked as the API isn't available yet
      await delay(1000);
      return { teammateId, success: true };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const terminateSession = createAsyncThunk(
  'teammates/terminateSession',
  async ({ teammateId, sessionId }: { teammateId: string; sessionId: string }, { rejectWithValue }) => {
    try {
      // This is still mocked as the API isn't available yet
      await delay(1000);
      return { teammateId, sessionId };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'teammates/resetPassword',
  async ({ teammateId, newPassword }: { teammateId: string; newPassword: string }, { rejectWithValue }) => {
    try {
      // This is still mocked as the API isn't available yet
      await delay(1000);
      return { teammateId, success: true };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
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
