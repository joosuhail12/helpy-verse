
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { TeammatesState } from './types';
import { mockActivityLogs, mockAssignments } from './mockData';
import type { ActivityLog, NewTeammate, Teammate } from '@/types/teammate';
import { teammatesService } from '@/api/services/teammateService';
import { disable2FA, verify2FA } from './thunks';

const initialState: TeammatesState = {
  teammates: [],
  activityLogs: [],
  assignments: [],
  loading: false,
  error: null,
  lastFetchTime: null,
  retryCount: 0,
  teammatesDetails: null
};

// fetchTeammates
export const fetchTeammates = createAsyncThunk('teammates/fetchTeammates', async () => {
  const response = await teammatesService.fetchTeammates();
  return response.data;
});

export const createTeammate = createAsyncThunk('teammates/createTeammate', async (teammate: NewTeammate) => {
  const response = await teammatesService.createTeammate(teammate);
  return response.data;
});

export const updateTeammate = createAsyncThunk('teammates/updateTeammate', async (teammate: Teammate) => {
  try {
    const response = await teammatesService.updateTeammate(teammate.id, teammate);
    return response.data;
  } catch (error) {
    throw error;
  }
});

export const getTeammate = createAsyncThunk('teammates/getTeammate', async (teammateId: string) => {
  try {
    const response = await teammatesService.getTeammate(teammateId);
    return response.data;
  } catch (error) {
    throw error;
  }
});



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
      .addCase(fetchTeammates.fulfilled, (state, action) => {
        state.teammates = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchTeammates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch teammates';
      })
      .addCase(fetchTeammates.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTeammate.fulfilled, (state, action) => {
        state.teammates = action.payload;
      })
      .addCase(createTeammate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create teammate';
      })
      .addCase(updateTeammate.fulfilled, (state, action) => {
        state.teammates = state.teammates.map(teammate =>
          teammate.id === action.payload.id ? action.payload : teammate
        );
      })
      .addCase(updateTeammate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update teammate';
      })
      .addCase(getTeammate.fulfilled, (state, action) => {
        console.log(action.payload);
        state.teammatesDetails = action.payload;
      })
      .addCase(getTeammate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to get teammate';
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

  },
});

export const { addTeammateOptimistic, updateRolesOptimistic, addActivityLog } = teammatesSlice.actions;
export default teammatesSlice.reducer;
