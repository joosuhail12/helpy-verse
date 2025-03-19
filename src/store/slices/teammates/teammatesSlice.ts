
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TeammatesState } from './types';
import { 
  fetchTeammates, 
  updateTeammate, 
  updateTeammatesRole,
  fetchTeammateActivityLogs,
  fetchTeammateAssignments,
  fetchTeammateSessions,
  terminateSession,
  resetPassword,
  enable2FA,
  verify2FA,
  disable2FA
} from './actions';
import { Teammate, TeamAssignment, ActivityLog, TeammateStatus } from '@/types/teammate';
import { mockTeammates, mockActivityLogs, mockAssignments } from './mockData';

const initialState: TeammatesState = {
  items: mockTeammates, // Use mock data for initial state
  loading: false,
  error: null,
  lastFetchTime: null,
  retryCount: 0,
  activityLogs: mockActivityLogs,
  assignments: mockAssignments,
  teammates: mockTeammates, // Add missing property
  sessions: []
};

const teammatesSlice = createSlice({
  name: 'teammates',
  initialState,
  reducers: {
    setSelectedTeammate: (state, action: PayloadAction<string>) => {
      state.selectedTeammateId = action.payload;
    },
    clearSelectedTeammate: (state) => {
      state.selectedTeammateId = undefined;
    },
    setTeammateAssignments: (state, action: PayloadAction<TeamAssignment[]>) => {
      state.assignments = action.payload;
    },
    setTeammateSessions: (state, action: PayloadAction<any[]>) => {
      state.sessions = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch teammates
      .addCase(fetchTeammates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeammates.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.teammates = action.payload; // Update both items and teammates arrays
        state.lastFetchTime = Date.now();
      })
      .addCase(fetchTeammates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.retryCount += 1;
      })

      // Update teammate
      .addCase(updateTeammate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTeammate.fulfilled, (state, action) => {
        state.loading = false;
        
        // Update the teammate in both arrays
        const idx = state.items.findIndex(t => t.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx] = { ...state.items[idx], ...action.payload };
        }
        
        const teammateIdx = state.teammates.findIndex(t => t.id === action.payload.id);
        if (teammateIdx !== -1) {
          state.teammates[teammateIdx] = { ...state.teammates[teammateIdx], ...action.payload };
        }
      })
      .addCase(updateTeammate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update teammates role
      .addCase(updateTeammatesRole.fulfilled, (state, action) => {
        const { ids, role } = action.payload;
        
        // Update roles for all affected teammates
        state.items.forEach(teammate => {
          if (ids.includes(teammate.id)) {
            teammate.role = role;
          }
        });
        
        state.teammates.forEach(teammate => {
          if (ids.includes(teammate.id)) {
            teammate.role = role;
          }
        });
      })

      // Fetch activity logs
      .addCase(fetchTeammateActivityLogs.fulfilled, (state, action) => {
        state.activityLogs = action.payload;
      })

      // Fetch assignments
      .addCase(fetchTeammateAssignments.fulfilled, (state, action) => {
        state.assignments = action.payload;
      })

      // Sessions management
      .addCase(fetchTeammateSessions.fulfilled, (state, action) => {
        state.sessions = action.payload;
      })
      .addCase(terminateSession.fulfilled, (state, action) => {
        state.sessions = state.sessions.filter(s => s.id !== action.payload.sessionId);
      })

      // 2FA management
      .addCase(enable2FA.fulfilled, (state, action) => {
        // Would update the state as needed in a real app
      })
      .addCase(verify2FA.fulfilled, (state, action) => {
        // Would update the state as needed in a real app
      })
      .addCase(disable2FA.fulfilled, (state, action) => {
        // Would update the state as needed in a real app
      });
  }
});

export const { 
  setSelectedTeammate, 
  clearSelectedTeammate,
  setTeammateAssignments,
  setTeammateSessions
} = teammatesSlice.actions;

export default teammatesSlice.reducer;
