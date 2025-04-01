
// This file is kept for backward compatibility
// It re-exports all actions from the new structure

import { 
  fetchTeammates, 
  fetchTeammateDetails,
  addTeammate,
  updateTeammate,
  updateTeammatesRole,
  updateTeammatePermissions,
  fetchTeammateActivities,
  fetchTeammateAssignments,
  enable2FA,
  verify2FA,
  disable2FA,
  resetPassword,
  fetchTeammateSessions,
  terminateSession,
  resendInvitation
} from './thunks';

import { exportTeammates } from './actions/export';

export {
  // Core actions
  fetchTeammates,
  fetchTeammateDetails,
  addTeammate,
  
  // Update actions
  updateTeammate,
  updateTeammatesRole,
  updateTeammatePermissions,
  
  // Activity actions
  fetchTeammateActivities,
  
  // Assignment actions
  fetchTeammateAssignments,
  
  // Security actions
  enable2FA,
  verify2FA,
  disable2FA,
  resetPassword,
  
  // Session actions
  fetchTeammateSessions,
  terminateSession,
  
  // Invitation actions
  resendInvitation,
  
  // Export action
  exportTeammates
};
