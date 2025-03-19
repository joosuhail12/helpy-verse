
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

export interface Teammate {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  teams: string[];
  lastActive?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeammatesState {
  teammates: Teammate[];
  loading: boolean;
  error: string | null;
  selectedTeammate: Teammate | null;
  activities: any[]; // For activity logs
  assignments: any[]; // For teammate assignments
  sessions: any[]; // For active sessions
  twoFactorEnabled: boolean;
}

const initialState: TeammatesState = {
  teammates: [],
  loading: false,
  error: null,
  selectedTeammate: null,
  activities: [],
  assignments: [],
  sessions: [],
  twoFactorEnabled: false,
};

export const fetchTeammates = createAsyncThunk(
  'teammates/fetchTeammates',
  async (_, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      const response = await fetch('/api/teammates');
      if (!response.ok) {
        throw new Error('Failed to fetch teammates');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const teammatesSlice = createSlice({
  name: 'teammates',
  initialState,
  reducers: {
    setTeammates: (state, action: PayloadAction<Teammate[]>) => {
      state.teammates = action.payload;
    },
    selectTeammate: (state, action: PayloadAction<string>) => {
      state.selectedTeammate = state.teammates.find(teammate => teammate.id === action.payload) || null;
    },
    clearSelectedTeammate: (state) => {
      state.selectedTeammate = null;
    },
    setTeammateActivities: (state, action: PayloadAction<any[]>) => {
      state.activities = action.payload;
    },
    setTeammateAssignments: (state, action: PayloadAction<any[]>) => {
      state.assignments = action.payload;
    },
    setTeammateSessions: (state, action: PayloadAction<any[]>) => {
      state.sessions = action.payload;
    },
    toggleTwoFactorEnabled: (state, action: PayloadAction<boolean>) => {
      state.twoFactorEnabled = action.payload;
    },
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
      })
      .addCase(fetchTeammates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setTeammates,
  selectTeammate,
  clearSelectedTeammate,
  setTeammateActivities,
  setTeammateAssignments,
  setTeammateSessions,
  toggleTwoFactorEnabled,
} = teammatesSlice.actions;

export default teammatesSlice.reducer;
