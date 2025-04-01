
import { createAsyncThunk } from '@reduxjs/toolkit';
import { resendTeammateInvitation } from '@/api/services/teammatesService';

// Resend invitation to teammate
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
