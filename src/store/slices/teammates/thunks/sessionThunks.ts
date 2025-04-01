
import { createAsyncThunk } from '@reduxjs/toolkit';

// Fetch teammate sessions
export const fetchTeammateSessions = createAsyncThunk(
  'teammates/fetchSessions',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      console.log(`Fetching sessions for teammate with ID: ${teammateId}`);
      // Mocked API call for now
      const sessions = [
        { 
          id: '1', 
          deviceType: 'desktop', 
          deviceName: 'Chrome on Windows',
          location: 'New York, USA',
          ip: '192.168.1.1',
          startTime: new Date().toISOString(),
          lastActive: new Date().toISOString()
        },
        { 
          id: '2', 
          deviceType: 'mobile', 
          deviceName: 'Safari on iPhone',
          location: 'Dallas, USA',
          ip: '192.168.1.2',
          startTime: new Date().toISOString(),
          lastActive: new Date().toISOString()
        }
      ];
      
      return sessions;
    } catch (error: any) {
      console.error(`Error fetching sessions for teammate ID ${teammateId}:`, error);
      return rejectWithValue(error.message || 'Failed to fetch teammate sessions');
    }
  }
);

// Terminate session
export const terminateSession = createAsyncThunk(
  'teammates/terminateSession',
  async ({ teammateId, sessionId }: { teammateId: string, sessionId: string }, { rejectWithValue }) => {
    try {
      console.log(`Terminating session ${sessionId} for teammate with ID: ${teammateId}`);
      // Mocked API call
      return { sessionId, success: true };
    } catch (error: any) {
      console.error(`Error terminating session for teammate ID ${teammateId}:`, error);
      return rejectWithValue(error.message || 'Failed to terminate session');
    }
  }
);
