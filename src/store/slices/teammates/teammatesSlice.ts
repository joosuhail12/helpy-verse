
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Teammate, ActivityLog, TeamAssignment, Session } from '@/types/teammate';

export interface TeammatesState {
  teammates: Teammate[];
  selectedTeammate: Teammate | null;
  activities: Record<string, ActivityLog[]>;
  assignments: Record<string, TeamAssignment[]>;
  sessions: Record<string, Session[]>;
  loading: boolean;
  error: string | null;
}

const initialState: TeammatesState = {
  teammates: [],
  selectedTeammate: null,
  activities: {},
  assignments: {},
  sessions: {},
  loading: false,
  error: null,
};

// Async thunks
export const fetchTeammates = createAsyncThunk(
  'teammates/fetchTeammates',
  async (_, { rejectWithValue }) => {
    try {
      // Mock API call
      return mockTeammates;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTeammateDetails = createAsyncThunk(
  'teammates/fetchTeammateDetails',
  async (id: string, { rejectWithValue }) => {
    try {
      // Mock API call
      const teammate = mockTeammates.find(t => t.id === id);
      if (!teammate) {
        throw new Error('Teammate not found');
      }
      return teammate;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTeammateActivities = createAsyncThunk(
  'teammates/fetchTeammateActivities',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      // Mock API call
      return { teammateId, activities: [] };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTeammateAssignments = createAsyncThunk(
  'teammates/fetchTeammateAssignments',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      // Mock API call
      return { teammateId, assignments: [] };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTeammateSessions = createAsyncThunk(
  'teammates/fetchTeammateSessions',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      // Mock API call
      return { teammateId, sessions: [] };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const enable2FA = createAsyncThunk(
  'teammates/enable2FA',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      // Mock API call
      return { teammateId, setupKey: 'MOCK-2FA-SETUP-KEY' };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const verify2FA = createAsyncThunk(
  'teammates/verify2FA',
  async ({ teammateId, code }: { teammateId: string; code: string }, { rejectWithValue }) => {
    try {
      // Mock API call
      return { teammateId, success: true };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const disable2FA = createAsyncThunk(
  'teammates/disable2FA',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      // Mock API call
      return { teammateId, success: true };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'teammates/resetPassword',
  async ({ teammateId, newPassword }: { teammateId: string; newPassword: string }, { rejectWithValue }) => {
    try {
      // Mock API call
      return { teammateId, success: true };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const terminateSession = createAsyncThunk(
  'teammates/terminateSession',
  async ({ teammateId, sessionId }: { teammateId: string; sessionId: string }, { rejectWithValue }) => {
    try {
      // Mock API call
      return { teammateId, sessionId };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Mock data
const mockTeammates: Teammate[] = [
  {
    id: '1',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'admin',
    status: 'active',
    lastActive: '2023-05-15T10:30:00Z',
    createdAt: '2023-01-01T08:00:00Z',
    permissions: ['manage_users', 'manage_settings', 'manage_content'],
    is2FAEnabled: true,
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'agent',
    status: 'active',
    lastActive: '2023-05-14T14:45:00Z',
    createdAt: '2023-01-15T09:30:00Z',
    permissions: ['view_tickets', 'respond_tickets'],
    is2FAEnabled: false,
  },
];

const teammatesSlice = createSlice({
  name: 'teammates',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeammates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeammates.fulfilled, (state, action) => {
        state.loading = false;
        state.teammates = action.payload;
      })
      .addCase(fetchTeammates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTeammateDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeammateDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTeammate = action.payload;
      })
      .addCase(fetchTeammateDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTeammateActivities.fulfilled, (state, action) => {
        const { teammateId, activities } = action.payload;
        state.activities[teammateId] = activities;
      })
      .addCase(fetchTeammateAssignments.fulfilled, (state, action) => {
        const { teammateId, assignments } = action.payload;
        state.assignments[teammateId] = assignments;
      })
      .addCase(fetchTeammateSessions.fulfilled, (state, action) => {
        const { teammateId, sessions } = action.payload;
        state.sessions[teammateId] = sessions;
      })
      .addCase(enable2FA.fulfilled, (state, action) => {
        // Handle 2FA setup key response if needed
      })
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

export const teammatesReducer = teammatesSlice.reducer;
