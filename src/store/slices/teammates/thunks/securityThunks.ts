
import { createAsyncThunk } from '@reduxjs/toolkit';

// Enable 2FA for a teammate
export const enable2FA = createAsyncThunk(
  'teammates/enable2FA',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      console.log(`Enabling 2FA for teammate with ID: ${teammateId}`);
      // Mocked API response
      return {
        qrCode: 'otpauth://totp/Helpy:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=Helpy',
        setupKey: 'JBSWY3DPEHPK3PXP'
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to enable 2FA');
    }
  }
);

// Verify 2FA setup
export const verify2FA = createAsyncThunk(
  'teammates/verify2FA',
  async ({ teammateId, verificationCode }: { teammateId: string, verificationCode: string }, { rejectWithValue }) => {
    try {
      console.log(`Verifying 2FA code for teammate with ID: ${teammateId}`);
      // Mocked API call
      return { success: true };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to verify 2FA code');
    }
  }
);

// Disable 2FA
export const disable2FA = createAsyncThunk(
  'teammates/disable2FA',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      console.log(`Disabling 2FA for teammate with ID: ${teammateId}`);
      // Mocked API call
      return { success: true };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to disable 2FA');
    }
  }
);

// Reset password
export const resetPassword = createAsyncThunk(
  'teammates/resetPassword',
  async ({ teammateId, newPassword }: { teammateId: string, newPassword: string }, { rejectWithValue }) => {
    try {
      console.log(`Resetting password for teammate with ID: ${teammateId}`);
      // Mocked API call
      return { success: true };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to reset password');
    }
  }
);
