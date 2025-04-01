
import { createSlice } from '@reduxjs/toolkit';
import { TeammatesState } from './types';
import { fetchTeammates, fetchTeammateDetails } from './actions';

const initialState: TeammatesState = {
  teammates: [],
  selectedTeammate: null,
  activities: {},
  assignments: {},
  sessions: {},
  loading: false,
  error: null,
  lastFetchTime: null,
  retryCount: 0
};

const teammatesSlice = createSlice({
  name: 'teammates',
  initialState,
  reducers: {
    clearTeammateDetails: (state) => {
      state.selectedTeammate = null;
    },
    incrementRetryCount: (state) => {
      state.retryCount += 1;
    },
    resetRetryCount: (state) => {
      state.retryCount = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all teammates
      .addCase(fetchTeammates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeammates.fulfilled, (state, action) => {
        state.teammates = action.payload;
        state.loading = false;
        state.lastFetchTime = Date.now();
        state.retryCount = 0;
      })
      .addCase(fetchTeammates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch teammates';
      })
      
      // Fetch specific teammate details
      .addCase(fetchTeammateDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeammateDetails.fulfilled, (state, action) => {
        state.selectedTeammate = action.payload;
        state.loading = false;
      })
      .addCase(fetchTeammateDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch teammate details';
      });
  }
});

export const { clearTeammateDetails, incrementRetryCount, resetRetryCount } = teammatesSlice.actions;

export default teammatesSlice.reducer;
