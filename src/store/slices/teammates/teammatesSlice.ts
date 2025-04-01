
import { createSlice } from '@reduxjs/toolkit';
import { TeammatesState } from './types';
import { 
  fetchTeammates, 
  fetchTeammateDetails, 
  addTeammate,
  updateTeammate,
  updateTeammatesRole,
  fetchTeammateActivities,
  fetchTeammateAssignments,
  fetchTeammateSessions,
  terminateSession,
  resendInvitation
} from './thunks';

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
      })
      
      // Add other reducer cases for the newly added thunks
      // These are placeholders and should be expanded as needed
      .addCase(addTeammate.fulfilled, (state, action) => {
        state.teammates.push(action.payload);
      })
      
      .addCase(updateTeammate.fulfilled, (state, action) => {
        const index = state.teammates.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.teammates[index] = {...state.teammates[index], ...action.payload};
        }
      })
      
      .addCase(fetchTeammateActivities.fulfilled, (state, action) => {
        // Store activities by teammate ID
        state.activities[action.meta.arg] = action.payload;
      })
      
      .addCase(fetchTeammateAssignments.fulfilled, (state, action) => {
        // Store assignments by teammate ID
        state.assignments[action.meta.arg] = action.payload;
      })
      
      .addCase(fetchTeammateSessions.fulfilled, (state, action) => {
        // Store sessions by teammate ID
        state.sessions[action.payload.teammateId] = action.payload.sessions;
      });
  }
});

export const { clearTeammateDetails, incrementRetryCount, resetRetryCount } = teammatesSlice.actions;

export default teammatesSlice.reducer;
