
import { createAsyncThunk } from '@reduxjs/toolkit';

// Resend invitation to a teammate
export const resendInvitation = createAsyncThunk(
  'teammates/resendInvitation',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      console.log(`Resending invitation to teammate with ID: ${teammateId}`);
      // Mocked successful operation
      return { teammateId, success: true };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to resend invitation');
    }
  }
);
