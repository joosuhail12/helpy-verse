
import { createAsyncThunk } from '@reduxjs/toolkit';

// Terminate a session for a teammate
export const terminateSession = createAsyncThunk(
  'teammates/terminateSession',
  async ({ teammateId, sessionId }: { teammateId: string, sessionId: string }, { rejectWithValue }) => {
    try {
      // Mock API call
      console.log(`Terminating session ${sessionId} for teammate ${teammateId}`);
      
      // Mock successful operation
      return { teammateId, sessionId };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to terminate session');
    }
  }
);
