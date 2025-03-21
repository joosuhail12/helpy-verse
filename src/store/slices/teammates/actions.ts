import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Teammate, NewTeammate } from '@/types/teammate';
import { TeammatesState } from './types';
import { 
  fetchTeammates as fetchTeammatesThunk,
  fetchTeammateDetails as fetchTeammateDetailsThunk,
  fetchTeammateActivities as fetchTeammateActivitiesThunk,
  fetchTeammateAssignments as fetchTeammateAssignmentsThunk,
  fetchTeammateSessions as fetchTeammateSessionsThunk
} from './thunks';
import { 
  updateTeammate as updateTeammateThunk,
  updateTeammatesRole as updateTeammatesRoleThunk,
  updateTeammatePermissions as updateTeammatePermissionsThunk,
  resendInvitation as resendInvitationThunk
} from './thunks';
import {
  enable2FA as enable2FAThunk,
  verify2FA as verify2FAThunk,
  disable2FA as disable2FAThunk,
  resetPassword as resetPasswordThunk
} from './thunks';
import {
  terminateSession as terminateSessionThunk
} from './thunks';
import { createTeammate as createTeammateApi } from '@/api/services/teammatesService';

// Re-export all thunks for backward compatibility
export const fetchTeammates = fetchTeammatesThunk;
export const fetchTeammateDetails = fetchTeammateDetailsThunk;
export const updateTeammate = updateTeammateThunk;
export const resendInvitation = resendInvitationThunk;

// Add new teammates
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

// Re-export all other thunks for backward compatibility and to maintain unchanged functionality
export const fetchTeammateActivities = fetchTeammateActivitiesThunk;
export const fetchTeammateAssignments = fetchTeammateAssignmentsThunk;
export const fetchTeammateSessions = fetchTeammateSessionsThunk;
export const updateTeammatesRole = updateTeammatesRoleThunk;
export const updateTeammatePermissions = updateTeammatePermissionsThunk;
export const enable2FA = enable2FAThunk;
export const verify2FA = verify2FAThunk;
export const disable2FA = disable2FAThunk;
export const resetPassword = resetPasswordThunk;
export const terminateSession = terminateSessionThunk;

// Export the existing exportTeammates function that was directly in actions.ts
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
