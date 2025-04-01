
import { createAsyncThunk } from '@reduxjs/toolkit';

// Enable 2FA for a teammate
export const enable2FA = createAsyncThunk(
  'teammates/enable2FA',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      // Mock API call
      console.log(`Enabling 2FA for teammate ${teammateId}`);
      
      // Mock successful setup key
      const setupKey = 'ABCD1234EFGH5678IJKL9012';
      
      return { teammateId, setupKey };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to enable 2FA');
    }
  }
);

// Verify 2FA setup
export const verify2FA = createAsyncThunk(
  'teammates/verify2FA',
  async ({ teammateId, code }: { teammateId: string, code: string }, { rejectWithValue }) => {
    try {
      // Mock API call
      console.log(`Verifying 2FA code for teammate ${teammateId}: ${code}`);
      
      // Mock successful verification
      return { teammateId, verified: true };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Invalid verification code');
    }
  }
);

// Disable 2FA for a teammate
export const disable2FA = createAsyncThunk(
  'teammates/disable2FA',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      // Mock API call
      console.log(`Disabling 2FA for teammate ${teammateId}`);
      
      // Mock successful operation
      return { teammateId };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to disable 2FA');
    }
  }
);

// Reset password for a teammate
export const resetPassword = createAsyncThunk(
  'teammates/resetPassword',
  async ({ teammateId, newPassword }: { teammateId: string, newPassword: string }, { rejectWithValue }) => {
    try {
      // Mock API call
      console.log(`Resetting password for teammate ${teammateId}`);
      
      // Mock successful operation
      return { teammateId };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to reset password');
    }
  }
);
