import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Teammate, NewTeammate, ActivityLog } from '@/types/teammate';
import { mockTeammates, mockActivityLogs, mockAssignments } from './mockData';
import { CACHE_DURATION } from './types';
import type { TeammatesState } from './types';
import { uuid } from 'uuid';
import { getErrorMessage } from './utils';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchTeammates = createAsyncThunk(
  'teammates/fetchTeammates',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { teammates: TeammatesState };
    
    if (state.teammates.lastFetchTime) {
      const timeSinceLastFetch = Date.now() - state.teammates.lastFetchTime;
      if (timeSinceLastFetch < CACHE_DURATION) {
        return state.teammates.teammates;
      }
    }

    try {
      await delay(1000);
      return mockTeammates;
    } catch (error) {
      if (state.teammates.retryCount < 3) {
        await delay(1000 * (state.teammates.retryCount + 1));
        return rejectWithValue('Failed to fetch teammates. Retrying...');
      }
      return rejectWithValue('Failed to fetch teammates after multiple retries');
    }
  }
);

export const addTeammate = createAsyncThunk(
  'teammates/addTeammate',
  async (newTeammate: NewTeammate, { dispatch }) => {
    const teammate: Teammate = {
      id: Math.random().toString(36).substr(2, 9),
      ...newTeammate,
      status: 'active',
      lastActive: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newTeammate.name}`,
      permissions: []
    };

    try {
      await delay(1000);
      return teammate;
    } catch (error) {
      throw error;
    }
  }
);

export const resendInvitation = createAsyncThunk(
  'teammates/resendInvitation',
  async (teammateId: string, { rejectWithValue }) => {
    try {
      await delay(1000);
      return teammateId;
    } catch (error) {
      return rejectWithValue('Failed to resend invitation');
    }
  }
);

export const updateTeammatesRole = createAsyncThunk(
  'teammates/updateTeammatesRole',
  async ({ teammateIds, role }: { teammateIds: string[], role: Teammate['role'] }, { rejectWithValue }) => {
    try {
      await delay(1000);
      return { teammateIds, role };
    } catch (error) {
      return rejectWithValue('Failed to update roles');
    }
  }
);

export const exportTeammates = createAsyncThunk(
  'teammates/exportTeammates',
  async (teammateIds: string[], { getState, rejectWithValue }) => {
    try {
      await delay(1000);
      const state = getState() as { teammates: TeammatesState };
      const selectedTeammates = state.teammates.teammates.filter(t => teammateIds.includes(t.id));
      console.log('Exporting teammates:', selectedTeammates);
      return teammateIds;
    } catch (error) {
      return rejectWithValue('Failed to export teammates');
    }
  }
);

export const updateTeammate = createAsyncThunk(
  'teammates/updateTeammate',
  async (teammate: Teammate) => {
    await delay(1000);
    return teammate;
  }
);

export const updateTeammatePermissions = createAsyncThunk(
  'teammates/updateTeammatePermissions',
  async ({ teammateId, permissions }: { teammateId: string, permissions: string[] }) => {
    await delay(1000);
    return { teammateId, permissions };
  }
);

export const createTeammate = createAsyncThunk(
  'teammates/createTeammate',
  async (teammate: NewTeammate, { rejectWithValue }) => {
    try {
      const response = await teammatesService.createTeammate(teammate);
      
      const createdTeammate: Teammate = {
        id: response.data[0].id || uuid(),
        name: `${teammate.first_name} ${teammate.last_name}`,
        email: teammate.email,
        role: teammate.role,
        status: 'active',
        teamId: null,
        createdBy: 'current-user',
        lastActive: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        avatar: response.data[0].avatar || '',
        permissions: []
      };
      
      return createdTeammate;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);
