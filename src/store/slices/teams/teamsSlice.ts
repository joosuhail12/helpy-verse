
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { teamsService } from '@/api/services/teamsService';
import type { Team, TeamsState } from '@/types/team';

// Async thunks for API operations
export const fetchTeams = createAsyncThunk(
  'teams/fetchTeams',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await teamsService.fetchTeams(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch teams');
    }
  }
);

export const fetchTeamById = createAsyncThunk(
  'teams/fetchTeamById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await teamsService.getTeam(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch team details');
    }
  }
);

export const createTeam = createAsyncThunk(
  'teams/createTeam',
  async (teamData: any, { rejectWithValue }) => {
    try {
      const response = await teamsService.createTeam(teamData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create team');
    }
  }
);

export const updateTeam = createAsyncThunk(
  'teams/updateTeam',
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await teamsService.updateTeam(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update team');
    }
  }
);

export const deleteTeam = createAsyncThunk(
  'teams/deleteTeam',
  async (id: string, { rejectWithValue }) => {
    try {
      await teamsService.deleteTeam(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete team');
    }
  }
);

const initialState: TeamsState = {
  teams: [],
  loading: false,
  error: null,
  teamDetails: null,
  areTeamsLoaded: false
};

export const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setTeams: (state, action: PayloadAction<Team[]>) => {
      state.teams = action.payload;
      state.loading = false;
      state.areTeamsLoaded = true;
    },
    resetTeamDetails: (state) => {
      state.teamDetails = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch teams
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
        state.error = action.payload as string;
      })
      // Fetch team by ID
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
        state.error = action.payload as string;
      })
      // Create team
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
        state.error = action.payload as string;
      })
      // Update team
      .addCase(updateTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTeam.fulfilled, (state, action) => {
        const index = state.teams.findIndex(team => team.id === action.payload.id);
        if (index !== -1) {
          state.teams[index] = action.payload;
        }
        state.teamDetails = action.payload;
        state.loading = false;
      })
      .addCase(updateTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete team
      .addCase(deleteTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTeam.fulfilled, (state, action) => {
        state.teams = state.teams.filter(team => team.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setLoading, setError, setTeams, resetTeamDetails } = teamsSlice.actions;

export default teamsSlice.reducer;
