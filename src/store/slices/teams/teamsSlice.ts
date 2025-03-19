
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { mockTeams } from './mockData';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'manager' | 'agent' | 'supervisor';
  status: 'active' | 'inactive';
}

export interface Channel {
  id: string;
  name: string;
  type: 'email' | 'chat' | 'voice' | 'social';
  isActive: boolean;
}

export interface RoutingRule {
  id: string;
  name: string;
  priority: number;
  isActive: boolean;
}

export interface OfficeHours {
  days: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
  startTime: string;
  endTime: string;
  timezone: string;
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  isRecurring: boolean;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  members: TeamMember[];
  channels: Channel[];
  routing: RoutingRule[];
  officeHours: OfficeHours;
  holidays: Holiday[];
  createdAt: string;
  updatedAt: string;
}

interface TeamsState {
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
    },
    addTeam: (state, action: PayloadAction<Team>) => {
      state.teams.push(action.payload);
    },
    updateTeam: (state, action: PayloadAction<{ id: string; updates: Partial<Team> }>) => {
      const { id, updates } = action.payload;
      const index = state.teams.findIndex(team => team.id === id);
      if (index !== -1) {
        state.teams[index] = { ...state.teams[index], ...updates };
      }
    },
    deleteTeam: (state, action: PayloadAction<string>) => {
      state.teams = state.teams.filter(team => team.id !== action.payload);
    },
    selectTeam: (state, action: PayloadAction<string>) => {
      state.selectedTeam = state.teams.find(team => team.id === action.payload) || null;
    },
  },
});

export const {
  setLoading,
  setError,
  setTeams,
  addTeam,
  updateTeam,
  deleteTeam,
  selectTeam,
} = teamsSlice.actions;

export default teamsSlice.reducer;
