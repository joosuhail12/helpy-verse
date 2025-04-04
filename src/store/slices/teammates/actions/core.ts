
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { NewTeammate } from '@/types/teammate';
import { 
  fetchTeammates,
  fetchTeammateDetails,
  fetchTeammateActivities,
  fetchTeammateAssignments,
  fetchTeammateSessions,
  updateTeammate,
  updateTeammatesRole,
  updateTeammatePermissions,
  enable2FA,
  verify2FA,
  disable2FA,
  resetPassword,
  terminateSession
} from '../thunks';
import { createTeammate as createTeammateApi } from '@/api/services/teammatesService';

// Re-export the fetch thunks
export const fetchTeammates = fetchTeammates;
export const fetchTeammateDetails = fetchTeammateDetails;
export const fetchTeammateActivities = fetchTeammateActivities;
export const fetchTeammateAssignments = fetchTeammateAssignments;
export const fetchTeammateSessions = fetchTeammateSessions;

// Re-export the update thunks
export const updateTeammate = updateTeammate;
export const updateTeammatesRole = updateTeammatesRole;
export const updateTeammatePermissions = updateTeammatePermissions;

// Re-export the security thunks
export const enable2FA = enable2FA;
export const verify2FA = verify2FA;
export const disable2FA = disable2FA;
export const resetPassword = resetPassword;

// Re-export the session thunks
export const terminateSession = terminateSession;

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
