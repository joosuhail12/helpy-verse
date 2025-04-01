
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getTeammates, getTeammateById } from '@/api/services/teammatesService';
import type { Teammate } from '@/types/teammate';

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
