
import { createAsyncThunk } from '@reduxjs/toolkit';

// Helper to simulate API call for mocked features that aren't implemented yet
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
