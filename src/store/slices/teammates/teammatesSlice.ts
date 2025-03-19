
import { createSlice } from '@reduxjs/toolkit';
import { mockTeammates, mockActivityLogs, mockAssignments } from './mockData';
import { 
  fetchTeammates, 
  addTeammate, 
  deleteTeammate, 
  updateTeammate,
  resendInvitation,
  updateTeammatesRole,
  exportTeammates
} from './actions';
import { Teammate, ActivityLog, TeamAssignment, TeammateSession } from '@/types/teammate';

interface TeammatesState {
  items: Teammate[];
  selectedTeammate: Teammate | null;
  selectedTeammates: string[];
  loading: boolean;
  error: string | null;
  activityLogs: ActivityLog[];
  assignments: TeamAssignment[];
  sessions: TeammateSession[];
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
  filters: {
    role: string | null;
    status: string | null;
    search: string;
  };
  sort: {
    field: keyof Teammate;
    direction: 'asc' | 'desc';
  };
}

const initialState: TeammatesState = {
  items: mockTeammates,
  selectedTeammate: null,
  selectedTeammates: [],
  loading: false,
  error: null,
  activityLogs: mockActivityLogs,
  assignments: mockAssignments,
  sessions: [],
  pagination: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: mockTeammates.length,
    totalPages: Math.ceil(mockTeammates.length / 10),
  },
  filters: {
    role: null,
    status: null,
    search: '',
  },
  sort: {
    field: 'name',
    direction: 'asc',
  },
};

const teammatesSlice = createSlice({
  name: 'teammates',
  initialState,
  reducers: {
    selectTeammate: (state, action) => {
      state.selectedTeammate = state.items.find(
        (teammate) => teammate.id === action.payload
      ) || null;
    },
    toggleTeammateSelection: (state, action) => {
      const teammateId = action.payload;
      if (state.selectedTeammates.includes(teammateId)) {
        state.selectedTeammates = state.selectedTeammates.filter(
          (id) => id !== teammateId
        );
      } else {
        state.selectedTeammates.push(teammateId);
      }
    },
    clearSelectedTeammates: (state) => {
      state.selectedTeammates = [];
    },
    setFilter: (state, action) => {
      const { key, value } = action.payload;
      state.filters[key as keyof typeof state.filters] = value;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setSortField: (state, action) => {
      const field = action.payload;
      if (state.sort.field === field) {
        state.sort.direction = state.sort.direction === 'asc' ? 'desc' : 'asc';
      } else {
        state.sort.field = field;
        state.sort.direction = 'asc';
      }
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    setItemsPerPage: (state, action) => {
      state.pagination.itemsPerPage = action.payload;
      state.pagination.totalPages = Math.ceil(
        state.pagination.totalItems / action.payload
      );
      // Reset to first page when changing items per page
      state.pagination.currentPage = 1;
    },
    setTeammateAssignments: (state, action) => {
      state.assignments = action.payload;
    },
    setTeammateSessions: (state, action) => {
      state.sessions = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchTeammates action states
      .addCase(fetchTeammates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeammates.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.pagination.totalItems = action.payload.length;
        state.pagination.totalPages = Math.ceil(
          action.payload.length / state.pagination.itemsPerPage
        );
      })
      .addCase(fetchTeammates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Handle addTeammate action states
      .addCase(addTeammate.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.pagination.totalItems = state.items.length;
        state.pagination.totalPages = Math.ceil(
          state.items.length / state.pagination.itemsPerPage
        );
      })
      // Handle deleteTeammate action states
      .addCase(deleteTeammate.fulfilled, (state, action) => {
        const teammateId = action.payload;
        state.items = state.items.filter((teammate) => teammate.id !== teammateId);
        state.selectedTeammates = state.selectedTeammates.filter(
          (id) => id !== teammateId
        );
        state.pagination.totalItems = state.items.length;
        state.pagination.totalPages = Math.ceil(
          state.items.length / state.pagination.itemsPerPage
        );
        if (state.selectedTeammate?.id === teammateId) {
          state.selectedTeammate = null;
        }
      })
      // Handle updateTeammate action states
      .addCase(updateTeammate.fulfilled, (state, action) => {
        const updatedTeammate = action.payload;
        const index = state.items.findIndex(
          (teammate) => teammate.id === updatedTeammate.id
        );
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...updatedTeammate };
        }
        if (
          state.selectedTeammate &&
          state.selectedTeammate.id === updatedTeammate.id
        ) {
          state.selectedTeammate = {
            ...state.selectedTeammate,
            ...updatedTeammate,
          };
        }
      })
      // Handle resendInvitation action states
      .addCase(resendInvitation.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const index = state.items.findIndex((teammate) => teammate.id === id);
        if (index !== -1) {
          state.items[index].status = status;
        }
      })
      // Handle updateTeammatesRole action states
      .addCase(updateTeammatesRole.fulfilled, (state, action) => {
        action.payload.forEach((update) => {
          const index = state.items.findIndex(
            (teammate) => teammate.id === update.id
          );
          if (index !== -1) {
            state.items[index].role = update.role;
          }
        });
      });
  },
});

export const {
  selectTeammate,
  toggleTeammateSelection,
  clearSelectedTeammates,
  setFilter,
  resetFilters,
  setSortField,
  setCurrentPage,
  setItemsPerPage,
  setTeammateAssignments,
  setTeammateSessions,
} = teammatesSlice.actions;

export const fetchTeammateAssignments = (teammateId: string) => async (dispatch: any) => {
  // Mock implementation to fetch assignments
  const assignments = mockAssignments.filter(a => a.teammateId === teammateId);
  dispatch(setTeammateAssignments(assignments));
};

export const fetchTeammateSessions = (teammateId: string) => async (dispatch: any) => {
  // Mock implementation to fetch sessions
  const sessions: TeammateSession[] = [
    {
      id: '1',
      device: 'Desktop',
      browser: 'Chrome',
      ip: '192.168.1.1',
      location: 'New York, USA',
      lastActive: new Date().toISOString(),
      current: true
    }
  ];
  dispatch(setTeammateSessions(sessions));
};

export const terminateSession = (sessionId: string) => async (dispatch: any, getState: any) => {
  // Mock implementation to terminate session
  const state = getState();
  const sessions = state.teammates.sessions.filter((s: TeammateSession) => s.id !== sessionId);
  dispatch(setTeammateSessions(sessions));
  return { payload: sessionId };
};

export const resetPassword = (teammateId: string) => async () => {
  // Mock implementation to reset password
  console.log(`Password reset for teammate ${teammateId}`);
  return { payload: teammateId };
};

export default teammatesSlice.reducer;
