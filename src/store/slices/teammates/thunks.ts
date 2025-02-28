
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Teammate, NewTeammate } from '@/types/teammate';
import { mockTeammates, mockActivityLogs, mockSessions, mockAssignments } from './mockData';
import { TeammatesState } from './types';

// Helper to simulate API call
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchTeammates = createAsyncThunk(
  'teammates/fetchTeammates',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { teammates: TeammatesState };

    try {
      // Mock API call
      await delay(1000);
      return mockTeammates;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTeammateDetails = createAsyncThunk(
  'teammates/fetchTeammateDetails',
  async (id: string, { rejectWithValue }) => {
    try {
      // Mock API call
      await delay(1000);
      const teammate = mockTeammates.find(t => t.id === id);
      if (!teammate) {
        throw new Error('Teammate not found');
      }
      return teammate;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTeammateActivities = createAsyncThunk(
  'teammates/fetchTeammateActivities',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      // Mock API call
      await delay(1000);
      return {
        teammateId,
        activities: mockActivityLogs.filter(log => log.teammateId === teammateId)
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
      // Mock API call
      await delay(1000);
      return {
        teammateId,
        assignments: mockAssignments.filter(a => a.teammateId === teammateId)
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
      // Mock API call
      await delay(1000);
      return {
        teammateId,
        sessions: mockSessions.filter(s => s.teammateId === teammateId)
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTeammate = createAsyncThunk(
  'teammates/updateTeammate',
  async (teammate: Teammate, { rejectWithValue }) => {
    try {
      // Mock API call
      await delay(1000);
      return teammate;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const enable2FA = createAsyncThunk(
  'teammates/enable2FA',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      // Mock API call
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
      // Mock API call
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
      // Mock API call
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
      // Mock API call
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
      // Mock API call
      await delay(1000);
      return { teammateId, success: true };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
