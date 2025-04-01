
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { ActivityLog } from '@/types/teammate';

// Fetch teammate activities
export const fetchTeammateActivities = createAsyncThunk(
  'teammates/fetchActivities',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      console.log(`Fetching activities for teammate with ID: ${teammateId}`);
      // Mocked API call for now
      const activities: ActivityLog[] = [
        { 
          id: '1', 
          teammateId: teammateId, 
          action: 'login', 
          timestamp: new Date().toISOString(),
          details: { device: 'Chrome on Windows' },
          type: 'login',
          description: 'Logged in to the system' 
        },
        { 
          id: '2', 
          teammateId: teammateId, 
          action: 'updated_profile', 
          timestamp: new Date().toISOString(),
          details: { fields: ['name', 'role'] },
          type: 'updated_profile',
          description: 'Updated profile information' 
        }
      ];
      
      return activities;
    } catch (error: any) {
      console.error(`Error fetching activities for teammate ID ${teammateId}:`, error);
      return rejectWithValue(error.message || 'Failed to fetch teammate activities');
    }
  }
);
