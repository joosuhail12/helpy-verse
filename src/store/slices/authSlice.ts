
// This file re-exports everything from the refactored auth slice
// for backward compatibility

// First, import the reducer directly
import authReducer from './auth/authSlice';

// Then re-export actions and types
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

// Export the default authReducer
export default authReducer;
