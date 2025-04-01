
import { createAsyncThunk } from '@reduxjs/toolkit';

// Fetch teammate activities
export const fetchTeammateActivities = createAsyncThunk(
  'teammates/fetchActivities',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      console.log(`Fetching activities for teammate with ID: ${teammateId}`);
      // Mocked API call for now
      const activities = [
        { id: '1', type: 'login', description: 'Logged in to the system', timestamp: new Date().toISOString() },
        { id: '2', type: 'updated_profile', description: 'Updated profile information', timestamp: new Date().toISOString() }
      ];
      
      return activities;
    } catch (error: any) {
      console.error(`Error fetching activities for teammate ID ${teammateId}:`, error);
      return rejectWithValue(error.message || 'Failed to fetch teammate activities');
    }
  }
);
