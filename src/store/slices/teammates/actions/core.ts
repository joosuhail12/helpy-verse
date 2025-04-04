
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { NewTeammate } from '@/types/teammate';
import { 
  fetchTeammates as fetchTeammatesThunk,
  fetchTeammateDetails as fetchTeammateDetailsThunk,
  fetchTeammateActivities as fetchTeammateActivitiesThunk,
  fetchTeammateAssignments as fetchTeammateAssignmentsThunk,
  fetchTeammateSessions as fetchTeammateSessionsThunk
} from '../thunks';
import { 
  updateTeammate as updateTeammateThunk,
  updateTeammatesRole as updateTeammatesRoleThunk,
  updateTeammatePermissions as updateTeammatePermissionsThunk
} from '../thunks';
import {
  enable2FA as enable2FAThunk,
  verify2FA as verify2FAThunk,
  disable2FA as disable2FAThunk,
  resetPassword as resetPasswordThunk
} from '../thunks';
import {
  terminateSession as terminateSessionThunk
} from '../thunks';
import { createTeammate as createTeammateApi } from '@/api/services/teammatesService';

// Re-export the fetch thunks
export const fetchTeammates = fetchTeammatesThunk;
export const fetchTeammateDetails = fetchTeammateDetailsThunk;
export const fetchTeammateActivities = fetchTeammateActivitiesThunk;
export const fetchTeammateAssignments = fetchTeammateAssignmentsThunk;
export const fetchTeammateSessions = fetchTeammateSessionsThunk;

// Re-export the update thunks
export const updateTeammate = updateTeammateThunk;
export const updateTeammatesRole = updateTeammatesRoleThunk;
export const updateTeammatePermissions = updateTeammatePermissionsThunk;

// Re-export the security thunks
export const enable2FA = enable2FAThunk;
export const verify2FA = verify2FAThunk;
export const disable2FA = disable2FAThunk;
export const resetPassword = resetPasswordThunk;

// Re-export the session thunks
export const terminateSession = terminateSessionThunk;

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
