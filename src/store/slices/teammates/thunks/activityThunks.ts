
import { createAsyncThunk } from '@reduxjs/toolkit';
import { mockActivityLogs } from '../mockData';

// Fetch teammate activities
export const fetchTeammateActivities = createAsyncThunk(
  'teammates/fetchTeammateActivities',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      console.log(`Fetching activities for teammate ${teammateId}`);
      
      // Filter activities from mock data
      const activities = mockActivityLogs.filter(log => log.teammateId === teammateId);
      
      return activities;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch teammate activities');
    }
  }
);
