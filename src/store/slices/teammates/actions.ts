
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Teammate, NewTeammate } from '@/types/teammate';
import { TeammatesState } from './types';
import { fetchTeammates as fetchTeammatesThunk } from './thunks';
import { updateTeammate as updateTeammateThunk } from './thunks';
import { createTeammate as createTeammateApi } from '@/api/services/teammatesService';
import { resendInvitation as resendInvitationThunk } from './thunks';

// Re-export the fetchTeammates action for backward compatibility
export const fetchTeammates = fetchTeammatesThunk;

// Re-export the updateTeammate action for backward compatibility
export const updateTeammate = updateTeammateThunk;

// Re-export the resendInvitation action for backward compatibility
export const resendInvitation = resendInvitationThunk;

export const addTeammate = createAsyncThunk(
  'teammates/addTeammate',
  async (newTeammate: NewTeammate, { dispatch }) => {
    try {
      const teammate = await createTeammateApi(newTeammate);
      return teammate;
    } catch (error) {
      throw error;
    }
  }
);

export const updateTeammatesRole = createAsyncThunk(
  'teammates/updateTeammatesRole',
  async ({ teammateIds, role }: { teammateIds: string[], role: Teammate['role'] }, { rejectWithValue }) => {
    try {
      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
      await delay(1000); // Simulate API call until endpoint is ready
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
      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
      await delay(1000); // Simulate API call until endpoint is ready
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
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    await delay(1000); // Simulate API call until endpoint is ready
    return { teammateId, permissions };
  }
);
