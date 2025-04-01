
import { createAsyncThunk } from '@reduxjs/toolkit';

// Fetch active sessions for a teammate
export const fetchTeammateSessions = createAsyncThunk(
  'teammates/fetchSessions',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      console.log(`Fetching sessions for teammate with ID: ${teammateId}`);
      // Mock data for now
      const sessions = [
        { id: '1', deviceName: 'Chrome on Windows', startTime: new Date().toISOString(), ipAddress: '192.168.1.1', active: true },
        { id: '2', deviceName: 'Firefox on Mac', startTime: new Date(Date.now() - 86400000).toISOString(), ipAddress: '192.168.1.2', active: true }
      ];
      return { teammateId, sessions };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch teammate sessions');
    }
  }
);

// Terminate an active session
export const terminateSession = createAsyncThunk(
  'teammates/terminateSession',
  async ({ teammateId, sessionId }: { teammateId: string; sessionId: string }, { rejectWithValue }) => {
    try {
      console.log(`Terminating session ${sessionId} for teammate ${teammateId}`);
      // In a real implementation, this would call an API
      return { teammateId, sessionId, success: true };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to terminate session');
    }
  }
);
