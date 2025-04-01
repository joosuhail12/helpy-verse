
import { createAsyncThunk } from '@reduxjs/toolkit';
import { mockSessions } from '../mockData';

// Fetch teammate sessions
export const fetchTeammateSessions = createAsyncThunk(
  'teammates/fetchTeammateSessions',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      console.log(`Fetching sessions for teammate ${teammateId}`);
      
      // Filter sessions from mock data
      const sessions = mockSessions.filter(
        session => session.teammateId === teammateId
      );
      
      return sessions;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch teammate sessions');
    }
  }
);

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
