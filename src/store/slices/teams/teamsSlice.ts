
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import type { Team } from '@/types/team';
import { mockTeams } from './mockData';

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
      // This would be replaced with an actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockTeams;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch teams');
    }
  }
);

export const fetchTeamById = createAsyncThunk(
  'teams/fetchTeamById',
  async (id: string, { rejectWithValue }) => {
    try {
      // This would be replaced with an actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const team = mockTeams.find(team => team.id === id);
      if (!team) {
        throw new Error('Team not found');
      }
      return team;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch team');
    }
  }
);

export const createTeam = createAsyncThunk(
  'teams/createTeam',
  async (team: Partial<Team>, { rejectWithValue }) => {
    try {
      // This would be replaced with an actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create a new team with default values
      const newTeam: Team = {
        id: `team-${Date.now()}`,
        name: team.name || 'New Team',
        description: team.description || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        members: team.members || [],
        icon: team.icon || 'users',
        status: team.status || 'active',
        type: team.type || 'support',
        memberCount: (team.members || []).length,
        officeHours: team.officeHours || {
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          startTime: '09:00',
          endTime: '17:00',
          timezone: 'UTC',
        },
        channels: team.channels || [],
        routing: team.routing || [],
        holidays: team.holidays || [],
      };
      
      return newTeam;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create team');
    }
  }
);

export const updateTeam = createAsyncThunk(
  'teams/updateTeam',
  async (team: Team, { rejectWithValue }) => {
    try {
      // This would be replaced with an actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return team;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update team');
    }
  }
);

export const deleteTeam = createAsyncThunk(
  'teams/deleteTeam',
  async (id: string, { rejectWithValue }) => {
    try {
      // This would be replaced with an actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete team');
    }
  }
);

const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    clearSelectedTeam: (state) => {
      state.selectedTeam = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setTeams: (state, action: PayloadAction<Team[]>) => {
      state.teams = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.teams = action.payload;
        state.loading = false;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTeamById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamById.fulfilled, (state, action) => {
        state.selectedTeam = action.payload;
        state.loading = false;
      })
      .addCase(fetchTeamById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.teams.push(action.payload);
      })
      .addCase(updateTeam.fulfilled, (state, action) => {
        const index = state.teams.findIndex(team => team.id === action.payload.id);
        if (index !== -1) {
          state.teams[index] = action.payload;
        }
        if (state.selectedTeam?.id === action.payload.id) {
          state.selectedTeam = action.payload;
        }
      })
      .addCase(deleteTeam.fulfilled, (state, action) => {
        state.teams = state.teams.filter(team => team.id !== action.payload);
        if (state.selectedTeam?.id === action.payload) {
          state.selectedTeam = null;
        }
      });
  }
});

export const { clearSelectedTeam, setLoading, setError, setTeams } = teamsSlice.actions;

export default teamsSlice.reducer;
