
// Import all thunks from files
import { 
  fetchTeammateActivities 
} from './activityThunks';

import { 
  fetchTeammateAssignments 
} from './assignmentThunks';

import { 
  enable2FA, 
  verify2FA, 
  disable2FA, 
  resetPassword 
} from './securityThunks';

import { 
  fetchTeammateSessions, 
  terminateSession 
} from './sessionThunks';

import { 
  updateTeammate, 
  updateTeammatesRole, 
  updateTeammatePermissions 
} from './updateThunks';

import { 
  resendInvitation as resendTeammateInvitation 
} from './invitationThunks';

import { 
  fetchTeammates, 
  fetchTeammateDetails, 
  addTeammate 
} from './coreThunks';

// Re-export all thunks with explicit naming to avoid conflicts
export { 
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
  
  // Update thunks  
  updateTeammate,
  updateTeammatesRole,
  updateTeammatePermissions,
  
  // Invitation thunks - renamed to avoid conflict
  resendTeammateInvitation as resendInvitation,
  
  // Core thunks
  fetchTeammates,
  fetchTeammateDetails,
  addTeammate
};
