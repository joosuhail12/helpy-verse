
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
  confirmPasswordReset,
  loginUserThunk,
  registerUserThunk,
  requestPasswordResetThunk,
  confirmPasswordResetThunk
} from './auth/authActions';

import { 
  fetchUserData, 
  fetchUserProfile, 
  fetchWorkspaceData,
  fetchUserDataThunk,
  fetchUserProfileThunk,
  fetchWorkspaceDataThunk
} from './auth/userActions';

import { 
  getUserPermission,
  getUserPermissionThunk
} from './auth/permissionActions';

// Import the auth slice reducer directly 
import authReducer, { 
  logout, 
  clearError, 
  setAuthLoading,
  setAuthError,
  setAuthSuccess,
  setPermissions,
  setUserData
} from './auth/authSlice';

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
  getUserPermission,
  setAuthLoading,
  setAuthError,
  setAuthSuccess,
  setPermissions,
  setUserData,
  // Legacy thunks
  loginUserThunk,
  registerUserThunk,
  requestPasswordResetThunk,
  confirmPasswordResetThunk,
  fetchUserDataThunk,
  fetchUserProfileThunk,
  fetchWorkspaceDataThunk,
  getUserPermissionThunk
};

// Re-export types
export type { Permission, Permissions, AuthState, ActionType };

// Export the reducer
export const reducer = authReducer;
export default authReducer;
