
// This file re-exports everything from the refactored auth slice
// for backward compatibility

import { 
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
  authReducer
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
  getUserPermission,
  authReducer
};

// Use 'export type' when re-exporting types with isolatedModules enabled
export type { Permission, Permissions, AuthState } from './auth/types';
export type { ActionType } from '@/utils/ability';
