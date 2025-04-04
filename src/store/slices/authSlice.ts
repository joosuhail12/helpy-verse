
/**
 * This file re-exports everything from the refactored auth slice
 * for backward compatibility without creating circular dependencies
 */

// Import the types directly from types file
import type { Permission, Permissions, AuthState } from './auth/types';
import type { ActionType } from '@/utils/ability';

// Import and re-export the actions
import { 
  loginUser, 
  registerUser, 
  requestPasswordReset, 
  confirmPasswordReset 
} from './auth/authActions';

import { 
  fetchUserData, 
  fetchUserProfile, 
  fetchWorkspaceData 
} from './auth/userActions';

import { getUserPermission } from './auth/permissionActions';

// Import the auth slice functions directly 
import { logout, clearError, reducer } from './auth/authSlice';

// Re-export everything
export { 
  logout, 
  clearError,
  loginUser,
  registerUser,
  requestPasswordReset,
  confirmPasswordReset,
  fetchUserData,
  fetchUserProfile,
  fetchWorkspaceData,
  getUserPermission
};

// Re-export types
export type { Permission, Permissions, AuthState, ActionType };

// Export the reducer separately
export default reducer;
