
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { Team, TeamsState } from '@/types/team';
import { HttpClient } from '@/api/services/HttpClient';
import teamsService from '@/api/services/teamsService';

const initialState: TeamsState = {
  teams: [],
  loading: false,
  error: null,
  teamDetails: null,
  areTeamsLoaded: false
  teamDetails: null
};

// fetch teams
export const fetchTeams = createAsyncThunk('teams/fetchTeams', async () => {
  const response = await teamsService.fetchTeams();
  return response.data;
});

// fetch team by id
export const fetchTeamById = createAsyncThunk('teams/fetchTeamById', async (id: string) => {
  const response = await teamsService.getTeamById(id);
  return response.data;
});

// create team
export const createTeam = createAsyncThunk('teams/createTeam', async (team: Team) => {
  const response = await teamsService.createTeam(team);
  return response.data;
});

// update team
export const updateTeam = createAsyncThunk(
  'teams/updateTeam',
  async ({ id, team }: { id: string; team: Team }) => {
    const response = await teamsService.updateTeam(id, team);
    return response.data;
  }
);

const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    setTeams: (state, action: PayloadAction<Team[]>) => {
      state.teams = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    builder.addCase(fetchTeams.pending, (state) => {
      state.loading = true;
    }),
      builder.addCase(fetchTeams.fulfilled, (state, action) => {
        state.teams = action.payload;
        state.loading = false;
        state.error = null;
        state.areTeamsLoaded = true;
      }),
      builder.addCase(fetchTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.areTeamsLoaded = true;
      }),
      builder.addCase(fetchTeamById.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(fetchTeamById.fulfilled, (state, action) => {
        state.teamDetails = action.payload;
        state.loading = false;
        state.error = null;
        state.areTeamsLoaded = true;
      }),
      builder.addCase(fetchTeamById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.areTeamsLoaded = true;
      }),
      builder.addCase(createTeam.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(createTeam.fulfilled, (state, action) => {
        state.teams = [...state.teams, action.payload];
        state.loading = false;
        state.areTeamsLoaded = true;
      }),
      builder.addCase(createTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.areTeamsLoaded = true;
      }),
      builder.addCase(updateTeam.pending, (state) => {
        state.loading = true;
      }),
      builder.addCase(updateTeam.fulfilled, (state, action) => {
        state.teams = state.teams.map((team) => team.id === action.payload.id ? action.payload : team);
        state.loading = false;
        state.areTeamsLoaded = true;
      }),
      builder.addCase(updateTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.areTeamsLoaded = true;
      });
  },
});

export const { setTeams, setLoading, setError } = teamsSlice.actions;
export default teamsSlice.reducer;
