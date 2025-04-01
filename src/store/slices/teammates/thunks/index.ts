
// Export all thunks from individual files
import { createAsyncThunk } from '@reduxjs/toolkit';
export * from './activityThunks';
export * from './assignmentThunks';
export * from './securityThunks';
export * from './sessionThunks';

// We need to be explicit with these imports to avoid conflicts
import {
  fetchTeammates,
  fetchTeammateDetails,
  updateTeammate,
  updateTeammatesRole,
  updateTeammatePermissions
} from './coreThunks';

// Re-export core thunks explicitly to avoid naming conflicts
export {
  fetchTeammates,
  fetchTeammateDetails,
  updateTeammate,
  updateTeammatesRole,
  updateTeammatePermissions
};

// Import and re-export from updateThunks
import { resendInvitation } from './updateThunks';
export { resendInvitation };

// Export action to add a new teammate
export const addTeammate = createAsyncThunk(
  'teammates/addTeammate',
  async (newTeammate: any, { rejectWithValue }) => {
    try {
      console.log('Adding new teammate:', newTeammate);
      // In a real implementation, this would call an API
      // For now, just return the new teammate with a fake ID
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

// Export teammate export functionality
export const exportTeammates = createAsyncThunk(
  'teammates/exportTeammates',
  async (teammateIds: string[] | { format?: string }, { rejectWithValue }) => {
    try {
      console.log('Exporting teammates:', teammateIds);
      // In a real implementation, this would generate and download a file
      // For now, just log the action
      return { success: true };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to export teammates');
    }
  }
);

// Create security thunks if they don't exist in securityThunks.ts
export const enable2FA = createAsyncThunk(
  'teammates/enable2FA',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      console.log(`Enabling 2FA for teammate ${teammateId}`);
      return { success: true, qrCode: 'mock-qr-code' };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to enable 2FA');
    }
  }
);

export const verify2FA = createAsyncThunk(
  'teammates/verify2FA',
  async ({ teammateId, verificationCode }: { teammateId: string, verificationCode: string }, { rejectWithValue }) => {
    try {
      console.log(`Verifying 2FA for teammate ${teammateId} with code ${verificationCode}`);
      return { success: true };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to verify 2FA');
    }
  }
);

export const disable2FA = createAsyncThunk(
  'teammates/disable2FA',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      console.log(`Disabling 2FA for teammate ${teammateId}`);
      return { success: true };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to disable 2FA');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'teammates/resetPassword',
  async ({ teammateId, newPassword }: { teammateId: string, newPassword: string }, { rejectWithValue }) => {
    try {
      console.log(`Resetting password for teammate ${teammateId}`);
      return { success: true };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to reset password');
    }
  }
);

export const fetchTeammateSessions = createAsyncThunk(
  'teammates/fetchTeammateSessions',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      console.log(`Fetching sessions for teammate ${teammateId}`);
      // Mock some session data
      return [
        {
          id: 'session-1',
          deviceName: 'Chrome on Windows',
          deviceType: 'desktop',
          location: 'San Francisco, CA',
          startTime: new Date().toISOString(),
          lastActive: new Date().toISOString(),
        },
        {
          id: 'session-2',
          deviceName: 'Mobile Safari',
          deviceType: 'mobile',
          location: 'New York, NY',
          startTime: new Date(Date.now() - 86400000).toISOString(),
          lastActive: new Date(Date.now() - 3600000).toISOString(),
        }
      ];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch teammate sessions');
    }
  }
);

export const terminateSession = createAsyncThunk(
  'teammates/terminateSession',
  async ({ teammateId, sessionId }: { teammateId: string, sessionId: string }, { rejectWithValue }) => {
    try {
      console.log(`Terminating session ${sessionId} for teammate ${teammateId}`);
      return { success: true };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to terminate session');
    }
  }
);
