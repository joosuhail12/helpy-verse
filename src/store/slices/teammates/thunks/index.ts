
// Export all thunks from individual files
import { createAsyncThunk } from '@reduxjs/toolkit';
export * from './activityThunks';
export * from './assignmentThunks';
export * from './securityThunks';
export * from './sessionThunks';

// We need to be explicit with these imports to avoid conflicts
import {
  fetchTeammates,
  fetchTeammateDetails,
  updateTeammate,
  updateTeammatesRole,
  updateTeammatePermissions
} from './coreThunks';

// Re-export core thunks explicitly to avoid naming conflicts
export {
  fetchTeammates,
  fetchTeammateDetails,
  updateTeammate,
  updateTeammatesRole,
  updateTeammatePermissions
};

// Import and re-export from updateThunks
import { resendInvitation } from './updateThunks';
export { resendInvitation };

// Export action to add a new teammate
export const addTeammate = createAsyncThunk(
  'teammates/addTeammate',
  async (newTeammate: any, { rejectWithValue }) => {
    try {
      console.log('Adding new teammate:', newTeammate);
      // In a real implementation, this would call an API
      // For now, just return the new teammate with a fake ID
      return {
        ...newTeammate,
        id: 'new-' + Date.now(),
        createdAt: new Date().toISOString()
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add teammate');
    }
  }
);

// Export teammate export functionality
export const exportTeammates = createAsyncThunk(
  'teammates/exportTeammates',
  async (teammateIds: string[] | { format?: string }, { rejectWithValue }) => {
    try {
      console.log('Exporting teammates:', teammateIds);
      // In a real implementation, this would generate and download a file
      // For now, just log the action
      return { success: true };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to export teammates');
    }
  }
);
