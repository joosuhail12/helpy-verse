
import { createAsyncThunk } from '@reduxjs/toolkit';
import { resendTeammateInvitation } from '@/api/services/teammatesService';
import { useToast } from '@/hooks/use-toast';

export const resendInvitation = createAsyncThunk(
  'teammates/resendInvitation',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      await resendTeammateInvitation(teammateId);
      return { teammateId, success: true };
    } catch (error: any) {
      console.error(`Error resending invitation to teammate ${teammateId}:`, error);
      return rejectWithValue(error.message || 'Failed to resend invitation');
    }
  }
);
