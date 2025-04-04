
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getTeammates, getTeammateById } from '@/api/services/teammatesService';
import type { ActivityLog, TeamAssignment, Session } from '@/types/teammate';

// Thunk to fetch all teammates
export const fetchTeammates = createAsyncThunk(
  'teammates/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching all teammates...');
      const teammates = await getTeammates();
      console.log(`Successfully fetched ${teammates.length} teammates`);
      return teammates;
    } catch (error: any) {
      console.error('Error fetching teammates:', error);
      return rejectWithValue(error.message || 'Failed to fetch teammates');
    }
  }
);

// Thunk to fetch a specific teammate by ID
export const fetchTeammateDetails = createAsyncThunk(
  'teammates/fetchDetails',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      console.log(`Fetching details for teammate with ID: ${teammateId}`);
      const teammate = await getTeammateById(teammateId);
      console.log('Teammate details fetched successfully:', teammate);
      return teammate;
    } catch (error: any) {
      console.error(`Error fetching teammate details for ID ${teammateId}:`, error);
      return rejectWithValue(error.message || 'Failed to fetch teammate details');
    }
  }
);

// Thunk to fetch activities for a specific teammate
export const fetchTeammateActivities = createAsyncThunk(
  'teammates/fetchActivities',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      // This would call an API in production
      console.log(`Fetching activities for teammate ${teammateId}`);
      
      // Using mock data for now
      const mockActivities: ActivityLog[] = [
        {
          id: '1',
          teammateId,
          action: 'login',
          timestamp: new Date().toISOString(),
          details: {},
          type: 'login',
          description: 'Logged in to the system'
        },
        {
          id: '2',
          teammateId,
          action: 'update',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          details: {},
          type: 'update',
          description: 'Updated profile information'
        }
      ];
      
      return mockActivities;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch teammate activities');
    }
  }
);

// Thunk to fetch team assignments for a specific teammate
export const fetchTeammateAssignments = createAsyncThunk(
  'teammates/fetchAssignments',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      // This would call an API in production
      console.log(`Fetching assignments for teammate ${teammateId}`);
      
      // Using mock data for now
      const mockAssignments: TeamAssignment[] = [
        {
          id: '1',
          teammateId,
          teamId: 'team-1',
          teamName: 'Support Team',
          role: 'Lead',
          assignedAt: '2023-01-01T08:00:00Z',
          startDate: '2023-01-01T08:00:00Z',
          status: 'active'
        }
      ];
      
      return mockAssignments;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch teammate assignments');
    }
  }
);

// Thunk to fetch sessions for a specific teammate
export const fetchTeammateSessions = createAsyncThunk(
  'teammates/fetchSessions',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      // This would call an API in production
      console.log(`Fetching sessions for teammate ${teammateId}`);
      
      // Using mock data for now
      const mockSessions: Session[] = [
        {
          id: '1',
          teammateId,
          deviceType: 'desktop',
          deviceName: 'Chrome on Windows',
          location: 'New York, USA',
          lastActive: new Date().toISOString(),
          ipAddress: '192.168.1.1',
          startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          endTime: null,
          userAgent: 'Mozilla/5.0',
          active: true
        }
      ];
      
      return mockSessions;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch teammate sessions');
    }
  }
);
