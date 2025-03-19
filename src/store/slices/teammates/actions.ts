
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Teammate, TeammateRole, TeammateStatus } from '@/types/teammate';
import { mockTeammates, mockActivityLogs, mockAssignments } from './mockData';

// Fetch teammates
export const fetchTeammates = createAsyncThunk(
  'teammates/fetchTeammates',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      return mockTeammates;
    } catch (error) {
      return rejectWithValue('Failed to fetch teammates');
    }
  }
);

// Update teammate
export const updateTeammate = createAsyncThunk(
  'teammates/updateTeammate',
  async ({ id, data }: { id: string, data: Partial<Teammate> }, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      return { id, ...data };
    } catch (error) {
      return rejectWithValue('Failed to update teammate');
    }
  }
);

// Update multiple teammates' roles
export const updateTeammatesRole = createAsyncThunk(
  'teammates/updateTeammatesRole',
  async ({ ids, role }: { ids: string[], role: TeammateRole }, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      return { ids, role };
    } catch (error) {
      return rejectWithValue('Failed to update teammates role');
    }
  }
);

// Export teammates
export const exportTeammates = createAsyncThunk(
  'teammates/exportTeammates',
  async ({ ids, format }: { ids: string[], format: 'csv' | 'json' }, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call that returns a file
      return { message: 'Exported successfully', format };
    } catch (error) {
      return rejectWithValue('Failed to export teammates');
    }
  }
);

// Fetch teammate activity logs
export const fetchTeammateActivityLogs = createAsyncThunk(
  'teammates/fetchTeammateActivityLogs',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      return mockActivityLogs;
    } catch (error) {
      return rejectWithValue('Failed to fetch activity logs');
    }
  }
);

// Fetch teammate assignments
export const fetchTeammateAssignments = createAsyncThunk(
  'teammates/fetchTeammateAssignments',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      return mockAssignments;
    } catch (error) {
      return rejectWithValue('Failed to fetch assignments');
    }
  }
);

// Add 2FA related actions
export const enable2FA = createAsyncThunk(
  'teammates/enable2FA',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      return { success: true, message: '2FA setup initialized' };
    } catch (error) {
      return rejectWithValue('Failed to initialize 2FA');
    }
  }
);

export const verify2FA = createAsyncThunk(
  'teammates/verify2FA',
  async ({ teammateId, verificationCode }: { teammateId: string, verificationCode: string }, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      return { success: true, message: '2FA verified successfully' };
    } catch (error) {
      return rejectWithValue('Failed to verify 2FA code');
    }
  }
);

export const disable2FA = createAsyncThunk(
  'teammates/disable2FA',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      return { success: true, message: '2FA disabled successfully' };
    } catch (error) {
      return rejectWithValue('Failed to disable 2FA');
    }
  }
);

// Session management
export const fetchTeammateSessions = createAsyncThunk(
  'teammates/fetchTeammateSessions',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      return [
        {
          id: '1',
          device: 'Chrome on Windows',
          browser: 'Chrome 94.0.4606.81',
          ip: '192.168.1.1',
          location: 'New York, USA',
          lastActive: new Date().toISOString(),
          current: true
        }
      ];
    } catch (error) {
      return rejectWithValue('Failed to fetch sessions');
    }
  }
);

export const terminateSession = createAsyncThunk(
  'teammates/terminateSession',
  async ({ teammateId, sessionId }: { teammateId: string, sessionId: string }, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      return { success: true, sessionId };
    } catch (error) {
      return rejectWithValue('Failed to terminate session');
    }
  }
);

// Password reset
export const resetPassword = createAsyncThunk(
  'teammates/resetPassword',
  async ({ teammateId, newPassword }: { teammateId: string, newPassword: string }, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      return { success: true, message: 'Password reset successfully' };
    } catch (error) {
      return rejectWithValue('Failed to reset password');
    }
  }
);
