
import { createAsyncThunk } from '@reduxjs/toolkit';

// Helper to simulate API call for mocked features that aren't implemented yet
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const enable2FA = createAsyncThunk(
  'teammates/enable2FA',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      // This is still mocked as the API isn't available yet
      await delay(1000);
      console.log(`Enabling 2FA for teammate ${teammateId}`);
      return { 
        teammateId, 
        qrCode: 'https://api.qrserver.com/v1/create-qr-code/?data=otpauth://totp/Example:user@example.com&secret=JBSWY3DPEHPK3PXP&issuer=Example&size=200x200',
        secret: 'JBSWY3DPEHPK3PXP'
      };
    } catch (error: any) {
      return rejectWithValue(error.message || `Failed to enable 2FA for teammate ${teammateId}`);
    }
  }
);

export const verify2FA = createAsyncThunk(
  'teammates/verify2FA',
  async ({ teammateId, code }: { teammateId: string, code: string }, { rejectWithValue }) => {
    try {
      // This is still mocked as the API isn't available yet
      await delay(1000);
      
      // Mock validation for testing - in real app this would call the API
      if (code === '123456' || code.length !== 6) {
        return rejectWithValue('Invalid verification code. Please try again.');
      }
      
      console.log(`Verifying 2FA for teammate ${teammateId} with code ${code}`);
      return { teammateId, verified: true };
    } catch (error: any) {
      return rejectWithValue(error.message || `Failed to verify 2FA for teammate ${teammateId}`);
    }
  }
);

export const disable2FA = createAsyncThunk(
  'teammates/disable2FA',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      // This is still mocked as the API isn't available yet
      await delay(1000);
      console.log(`Disabling 2FA for teammate ${teammateId}`);
      return { teammateId, disabled: true };
    } catch (error: any) {
      return rejectWithValue(error.message || `Failed to disable 2FA for teammate ${teammateId}`);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'teammates/resetPassword',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      // This is still mocked as the API isn't available yet
      await delay(1000);
      console.log(`Resetting password for teammate ${teammateId}`);
      return { teammateId, success: true };
    } catch (error: any) {
      return rejectWithValue(error.message || `Failed to reset password for teammate ${teammateId}`);
    }
  }
);
