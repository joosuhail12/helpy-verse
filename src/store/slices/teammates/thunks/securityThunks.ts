
import { createAsyncThunk } from '@reduxjs/toolkit';

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
