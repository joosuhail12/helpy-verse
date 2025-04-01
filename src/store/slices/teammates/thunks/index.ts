
// Export all thunks from individual files
import { createAsyncThunk } from '@reduxjs/toolkit';

// Import and export activity thunks
export * from './activityThunks';
export * from './assignmentThunks';
export * from './securityThunks';
export * from './sessionThunks';

// Import core thunks correctly
import {
  fetchTeammates,
  fetchTeammateDetails,
  updateTeammate,
  updateTeammatesRole,
  updateTeammatePermissions,
  addTeammate
} from './coreThunks';

// Re-export core thunks explicitly to avoid naming conflicts
export {
  fetchTeammates,
  fetchTeammateDetails,
  updateTeammate,
  updateTeammatesRole,
  updateTeammatePermissions,
  addTeammate
};

// Import and re-export from updateThunks (which contains resendInvitation)
import { resendInvitation } from './updateThunks';
export { resendInvitation };

// Export teammate export functionality
export const exportTeammates = createAsyncThunk(
  'teammates/exportTeammates',
  async (params: string[] | { format?: string }, { rejectWithValue }) => {
    try {
      console.log('Exporting teammates:', params);
      // In a real implementation, this would generate and download a file
      // For now, just log the action
      return { success: true };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to export teammates');
    }
  }
);
