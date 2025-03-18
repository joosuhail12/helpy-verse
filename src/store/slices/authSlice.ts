
// This file now re-exports everything from the refactored auth slice
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

export type { Permission, Permissions, AuthState } from './auth/types';
export { ActionType } from '@/utils/ability';

export default authReducer;
