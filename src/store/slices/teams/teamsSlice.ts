
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

export interface Team {
  id: string;
  name: string;
  description?: string;
  members: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TeamsState {
  teams: Team[];
  loading: boolean;
  error: string | null;
  selectedTeam: Team | null;
}

const initialState: TeamsState = {
  teams: [],
  loading: false,
  error: null,
  selectedTeam: null,
};

export const fetchTeams = createAsyncThunk(
  'teams/fetchTeams',
  async (_, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      const response = await fetch('/api/teams');
      if (!response.ok) {
        throw new Error('Failed to fetch teams');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    setTeams: (state, action: PayloadAction<Team[]>) => {
      state.teams = action.payload;
    },
    selectTeam: (state, action: PayloadAction<string>) => {
      state.selectedTeam = state.teams.find(team => team.id === action.payload) || null;
    },
    clearSelectedTeam: (state) => {
      state.selectedTeam = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = action.payload;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setTeams, selectTeam, clearSelectedTeam } = teamsSlice.actions;

export const selectTeams = (state: RootState) => state.teams.teams;
export const selectTeamsLoading = (state: RootState) => state.teams.loading;
export const selectTeamsError = (state: RootState) => state.teams.error;

export default teamsSlice.reducer;
