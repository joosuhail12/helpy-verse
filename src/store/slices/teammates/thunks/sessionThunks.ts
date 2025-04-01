
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Session } from '@/types/teammate';

// Fetch sessions for a teammate
export const fetchTeammateSessions = createAsyncThunk(
  'teammates/fetchTeammateSessions',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      // Mock API call
      console.log(`Fetching sessions for teammate ${teammateId}`);
      
      // Mock session data
      const sessions: Session[] = [
        {
          id: 'session-1',
          teammateId,
          startTime: new Date().toISOString(),
          endTime: null,
          ipAddress: '192.168.1.1',
          userAgent: 'Chrome/92.0.4515.159',
          active: true,
          deviceType: 'desktop',
          deviceName: 'Windows PC',
          location: 'San Francisco, CA',
          lastActive: new Date().toISOString()
        },
        {
          id: 'session-2',
          teammateId,
          startTime: new Date(Date.now() - 86400000).toISOString(),
          endTime: null,
          ipAddress: '192.168.1.2',
          userAgent: 'Mobile Safari/15.0',
          active: true,
          deviceType: 'mobile',
          deviceName: 'iPhone',
          location: 'New York, NY',
          lastActive: new Date(Date.now() - 3600000).toISOString()
        }
      ];
      
      return sessions;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch teammate sessions');
    }
  }
);

// Terminate a session
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
