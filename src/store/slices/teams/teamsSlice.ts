
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Team, TeamsState } from '@/types/team';
import { teamsService } from '@/api/services/teamsService';

const initialState: TeamsState = {
  teams: [],
  teamDetails: null,
  loading: false,
  error: null,
  areTeamsLoaded: false
};

// Async thunks
export const fetchTeams = createAsyncThunk(
  'teams/fetchTeams',
  async () => {
    try {
      const response = await teamsService.getTeams();
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const fetchTeamById = createAsyncThunk(
  'teams/fetchTeamById',
  async (id: string) => {
    try {
      const response = await teamsService.getTeamById(id);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const createTeam = createAsyncThunk(
  'teams/createTeam',
  async (team: Team) => {
    try {
      const response = await teamsService.createTeam(team);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Teams
      .addCase(fetchTeams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.teams = action.payload;
        state.loading = false;
        state.areTeamsLoaded = true;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch teams';
      })
      // Fetch Team by ID
      .addCase(fetchTeamById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamById.fulfilled, (state, action) => {
        state.teamDetails = action.payload;
        state.loading = false;
      })
      .addCase(fetchTeamById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch team details';
      })
      // Create Team
      .addCase(createTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.teams.push(action.payload);
        state.loading = false;
      })
      .addCase(createTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create team';
      });
  },
});

export default teamsSlice.reducer;
