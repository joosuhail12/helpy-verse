
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { NewTeammate } from '@/types/teammate';
import { createTeammate as createTeammateApi } from '@/api/services/teammatesService';

// Import thunks directly from the thunks file to avoid circular dependencies
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

// Re-export the thunks
export {
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
};

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
