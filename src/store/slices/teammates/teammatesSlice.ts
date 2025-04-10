
import { createSlice } from '@reduxjs/toolkit';
import { TeammatesState } from './types';
import {
  fetchTeammates,
  fetchTeammateDetails,
  fetchTeammateActivities,
  fetchTeammateAssignments,
  fetchTeammateSessions,
  updateTeammate,
  enable2FA,
  verify2FA,
  disable2FA,
  terminateSession,
  resetPassword
} from './actions';

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
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchTeammates
      .addCase(fetchTeammates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeammates.fulfilled, (state, action) => {
        state.loading = false;
        state.teammates = action.payload;
        state.lastFetchTime = Date.now();
        state.retryCount = 0;
      })
      .addCase(fetchTeammates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.retryCount += 1;
      })
      
      // fetchTeammateDetails
      .addCase(fetchTeammateDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeammateDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTeammate = action.payload;
        
        // Also update this teammate in the main teammates array if it exists
        const index = state.teammates.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.teammates[index] = action.payload;
        } else {
          // If not found in the array, add it
          state.teammates.push(action.payload);
        }
      })
      .addCase(fetchTeammateDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // fetchTeammateActivities
      .addCase(fetchTeammateActivities.fulfilled, (state, action) => {
        const { teammateId, activities } = action.payload;
        state.activities[teammateId] = activities;
      })
      
      // fetchTeammateAssignments
      .addCase(fetchTeammateAssignments.fulfilled, (state, action) => {
        const { teammateId, assignments } = action.payload;
        state.assignments[teammateId] = assignments;
      })
      
      // fetchTeammateSessions
      .addCase(fetchTeammateSessions.fulfilled, (state, action) => {
        const { teammateId, sessions } = action.payload;
        state.sessions[teammateId] = sessions;
      })
      
      // updateTeammate
      .addCase(updateTeammate.fulfilled, (state, action) => {
        const updatedTeammate = action.payload;
        state.teammates = state.teammates.map(teammate => 
          teammate.id === updatedTeammate.id ? updatedTeammate : teammate
        );
        if (state.selectedTeammate?.id === updatedTeammate.id) {
          state.selectedTeammate = updatedTeammate;
        }
      })
      
      // 2FA operations
      .addCase(verify2FA.fulfilled, (state, action) => {
        if (state.selectedTeammate && state.selectedTeammate.id === action.payload.teammateId) {
          state.selectedTeammate.is2FAEnabled = true;
        }
        const teammateIndex = state.teammates.findIndex(t => t.id === action.payload.teammateId);
        if (teammateIndex !== -1) {
          state.teammates[teammateIndex].is2FAEnabled = true;
        }
      })
      .addCase(disable2FA.fulfilled, (state, action) => {
        if (state.selectedTeammate && state.selectedTeammate.id === action.payload.teammateId) {
          state.selectedTeammate.is2FAEnabled = false;
        }
        const teammateIndex = state.teammates.findIndex(t => t.id === action.payload.teammateId);
        if (teammateIndex !== -1) {
          state.teammates[teammateIndex].is2FAEnabled = false;
        }
      })
      
      // Session operations
      .addCase(terminateSession.fulfilled, (state, action) => {
        const { teammateId, sessionId } = action.payload;
        if (state.sessions[teammateId]) {
          state.sessions[teammateId] = state.sessions[teammateId].filter(
            session => session.id !== sessionId
          );
        }
      });
  },
});

// Export the reducer directly as a named export
export const reducer = teammatesSlice.reducer;

// Export separately named reducer
export const teammatesReducer = teammatesSlice.reducer;

// Export actions
export * from './actions';
export * from './selectors';
