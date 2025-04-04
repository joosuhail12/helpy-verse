
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Session } from '@/types/teammate';

// Fetch active sessions for a teammate
export const fetchTeammateSessions = createAsyncThunk(
  'teammates/fetchSessions',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      console.log(`Fetching sessions for teammate with ID: ${teammateId}`);
      // Mock data for now
      const sessions: Session[] = [
        { 
          id: '1', 
          teammateId: teammateId, 
          deviceName: 'Chrome on Windows', 
          startTime: new Date().toISOString(), 
          endTime: null,
          ipAddress: '192.168.1.1', 
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          active: true,
          deviceType: 'desktop',
          location: 'New York, US',
          lastActive: new Date().toISOString()
        },
        { 
          id: '2', 
          teammateId: teammateId, 
          deviceName: 'Firefox on Mac', 
          startTime: new Date(Date.now() - 86400000).toISOString(), 
          endTime: null,
          ipAddress: '192.168.1.2', 
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:95.0)',
          active: true,
          deviceType: 'desktop',
          location: 'San Francisco, US',
          lastActive: new Date(Date.now() - 3600000).toISOString()
        }
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
