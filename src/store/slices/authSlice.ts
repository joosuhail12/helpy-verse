
// This file re-exports everything from the refactored auth slice
// for backward compatibility

import authReducer, { 
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
} from './auth/authSlice';

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

// Use 'export type' when re-exporting types with isolatedModules enabled
export type { Permission, Permissions, AuthState } from './auth/types';
export type { ActionType } from '@/utils/ability';

// Export the reducer as the default export
export default authReducer;
