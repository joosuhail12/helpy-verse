
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Teammate, NewTeammate, ActivityLog } from '@/types/teammate';
import { mockTeammates, mockActivityLogs, mockAssignments } from './mockData';
import { CACHE_DURATION } from './types';
import type { TeammatesState } from './types';
import { fetchTeammates as fetchTeammatesThunk } from './thunks';
import { updateTeammate as updateTeammateThunk } from './thunks';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Re-export the fetchTeammates action for backward compatibility
export const fetchTeammates = fetchTeammatesThunk;

// Re-export the updateTeammate action for backward compatibility
export const updateTeammate = updateTeammateThunk;

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

export const updateTeammatePermissions = createAsyncThunk(
  'teammates/updateTeammatePermissions',
  async ({ teammateId, permissions }: { teammateId: string, permissions: string[] }) => {
    await delay(1000);
    return { teammateId, permissions };
  }
);
