
import { createAsyncThunk } from '@reduxjs/toolkit';
import { mockSessions } from '../mockData';
import type { Session } from '@/types/teammate';

// Fetch active sessions for a teammate
export const fetchTeammateSessions = createAsyncThunk(
  'teammates/fetchSessions',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      console.log(`Fetching sessions for teammate with ID: ${teammateId}`);
      
      // Use mockSessions if available for the teammate, otherwise return empty array
      const sessions: Session[] = mockSessions[teammateId] || [];
      
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
