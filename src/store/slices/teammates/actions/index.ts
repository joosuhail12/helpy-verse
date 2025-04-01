
// Export all teammate actions for easy imports elsewhere
export * from './core';
export * from './export';
export * from './invite';
export * from './security';

// Re-export all thunks from the thunks directory to maintain backward compatibility
// This ensures components importing from '@/store/slices/teammates/actions' will find what they need
export {
  // Core thunks 
  fetchTeammates,
  fetchTeammateDetails,
  updateTeammate,
  addTeammate,
  
  // Role-related thunks
  updateTeammatesRole,
  updateTeammatePermissions,
  
  // Activity thunks
  fetchTeammateActivities,
  
  // Assignment thunks
  fetchTeammateAssignments,
  
  // Security thunks
  enable2FA,
  verify2FA,
  disable2FA,
  resetPassword,
  
  // Session thunks
  fetchTeammateSessions,
  terminateSession,
  
  // Invitation thunks
  resendInvitation,
  
  // Export functionality
  exportTeammates
} from '../thunks';
