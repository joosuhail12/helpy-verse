
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { ActivityLog } from '@/types/teammate';

// Fetch activity logs for a teammate
export const fetchTeammateActivities = createAsyncThunk(
  'teammates/fetchTeammateActivities',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      // Mock API call
      console.log(`Fetching activities for teammate ${teammateId}`);
      
      // Mock activity data
      const activities: ActivityLog[] = [
        {
          id: 'activity-1',
          teammateId,
          action: 'login',
          timestamp: new Date().toISOString(),
          details: { ipAddress: '192.168.1.1', browser: 'Chrome' },
          type: 'authentication',
          description: 'Logged in successfully'
        },
        {
          id: 'activity-2',
          teammateId,
          action: 'update_profile',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          details: { fields: ['name', 'email'] },
          type: 'profile',
          description: 'Updated profile information'
        },
        {
          id: 'activity-3',
          teammateId,
          action: 'assign_team',
          timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
          details: { teamId: 'team-1', teamName: 'Support Team' },
          type: 'team',
          description: 'Assigned to Support Team'
        }
      ];
      
      return activities;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch teammate activities');
    }
  }
);
