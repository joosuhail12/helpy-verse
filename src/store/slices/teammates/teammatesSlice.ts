
import { createSlice } from '@reduxjs/toolkit';
import type { TeammatesState } from './types';
import { mockActivityLogs, mockAssignments } from './mockData';
import {
  fetchTeammates,
  addTeammate,
  updateTeammate,
  updateTeammatePermissions,
  updateTeammatesRole,
  exportTeammates
} from './actions';
import type { ActivityLog } from '@/types/teammate';

const initialState: TeammatesState = {
  teammates: [],
  activityLogs: [],
  assignments: [],
  loading: false,
  error: null,
  lastFetchTime: null,
  retryCount: 0
};

const teammatesSlice = createSlice({
  name: 'teammates',
  initialState,
  reducers: {
    addTeammateOptimistic: (state, action) => {
      state.teammates.push(action.payload);
    },
    updateRolesOptimistic: (state, action) => {
      const { teammateIds, role } = action.payload;
      state.teammates = state.teammates.map(teammate => 
        teammateIds.includes(teammate.id)
          ? { ...teammate, role }
          : teammate
      );
    },
    addActivityLog: (state, action) => {
      state.activityLogs.unshift(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeammates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeammates.fulfilled, (state, action) => {
        state.loading = false;
        state.teammates = action.payload;
        state.activityLogs = mockActivityLogs;
        state.assignments = mockAssignments;
        state.lastFetchTime = Date.now();
        state.retryCount = 0;
      })
      .addCase(fetchTeammates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch teammates';
        state.retryCount += 1;
      })
      .addCase(addTeammate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add teammate';
      })
      .addCase(updateTeammate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update teammate';
      })
      .addCase(updateTeammatePermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update teammate permissions';
      })
      .addCase(exportTeammates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(exportTeammates.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(exportTeammates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to export teammates';
      });
  },
});

export const { addTeammateOptimistic, updateRolesOptimistic, addActivityLog } = teammatesSlice.actions;
export default teammatesSlice.reducer;
