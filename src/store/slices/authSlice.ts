
// This file re-exports everything from the refactored auth slice
// for backward compatibility

// First, import the actions and other exports that are not the reducer
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
} from './auth/authSlice';

// Import the default export (reducer) separately
import reducer from './auth/authSlice';

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
};

// Re-export the reducer as authReducer for backward compatibility
export const authReducer = reducer;

// Use 'export type' when re-exporting types with isolatedModules enabled
export type { Permission, Permissions, AuthState } from './auth/types';
export type { ActionType } from '@/utils/ability';
