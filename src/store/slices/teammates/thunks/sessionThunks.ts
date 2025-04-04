
import { createAsyncThunk } from '@reduxjs/toolkit';

// Helper to simulate API call for mocked features that aren't implemented yet
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const terminateSession = createAsyncThunk(
  'teammates/terminateSession',
  async ({ teammateId, sessionId }: { teammateId: string; sessionId: string }, { rejectWithValue }) => {
    try {
      // This is still mocked as the API isn't available yet
      await delay(1000);
      return { teammateId, sessionId };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
