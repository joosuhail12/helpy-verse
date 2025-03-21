
import { createAsyncThunk } from '@reduxjs/toolkit';
import { TeammatesState } from '../types';

// Export teammates function
export const exportTeammates = createAsyncThunk(
  'teammates/exportTeammates',
  async (teammateIds: string[], { getState, rejectWithValue }) => {
    try {
      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
      await delay(1000); // Simulate API call until endpoint is ready
      const state = getState() as { teammates: TeammatesState };
      const selectedTeammates = state.teammates.teammates.filter(t => teammateIds.includes(t.id));
      console.log('Exporting teammates:', selectedTeammates);
      return teammateIds;
    } catch (error) {
      return rejectWithValue('Failed to export teammates');
    }
  }
);
