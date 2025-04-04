
import { createAsyncThunk } from '@reduxjs/toolkit';

// Helper to simulate API call for mocked features that aren't implemented yet
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const terminateSession = createAsyncThunk(
  'teammates/terminateSession',
  async ({ teammateId, sessionId }: { teammateId: string, sessionId: string }, { rejectWithValue }) => {
    try {
      // This is still mocked as the API isn't available yet
      await delay(1000);
      console.log(`Terminating session ${sessionId} for teammate ${teammateId}`);
      return { teammateId, sessionId, success: true };
    } catch (error: any) {
      return rejectWithValue(error.message || `Failed to terminate session ${sessionId} for teammate ${teammateId}`);
    }
  }
);
