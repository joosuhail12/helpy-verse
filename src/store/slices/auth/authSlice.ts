
import { createSlice } from '@reduxjs/toolkit';
import { getCookie } from '@/utils/helpers/helpers';
import { handleLogout as tokenHandleLogout } from '@/utils/auth/tokenManager';
import { AuthState } from './types';

// Define the initial state
const initialState: AuthState = {
  isAuthenticated: !!getCookie("customerToken"),
  user: null,
  loading: false,
  error: null,
  permissions: [],
};

// Create the slice with reducers
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      // Call the improved token manager logout function
      tokenHandleLogout();
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  // We'll configure extraReducers after importing the action creators
  extraReducers: builder => {},
});

// Export actions from the slice
export const { logout, clearError } = authSlice.actions;

// Import the action creators AFTER creating the slice
import { 
  loginUser, 
  registerUser, 
  requestPasswordReset, 
  confirmPasswordReset 
} from './authActions';

import { 
  fetchUserData, 
  fetchUserProfile, 
  fetchWorkspaceData 
} from './userActions';

import { 
  getUserPermission 
} from './permissionActions';

// Now configure the extraReducers with the action creators
const authReducerWithExtraReducers = (state = initialState, action: any) => {
  // First try the regular reducers
  const newState = authSlice.reducer(state, action);
  
  // Handle extra reducers manually
  if (action.type === loginUser.pending.type) {
    return { ...newState, loading: true, error: null };
  }
  if (action.type === loginUser.fulfilled.type) {
    return { ...newState, loading: false, isAuthenticated: true, user: action.payload };
  }
  if (action.type === loginUser.rejected.type) {
    return { ...newState, loading: false, error: action.error.message || 'Login failed' };
  }
  
  // Register actions
  if (action.type === registerUser.pending.type) {
    return { ...newState, loading: true, error: null };
  }
  if (action.type === registerUser.fulfilled.type) {
    return { ...newState, loading: false, isAuthenticated: true, user: action.payload };
  }
  if (action.type === registerUser.rejected.type) {
    return { ...newState, loading: false, error: action.error.message || 'Registration failed' };
  }
  
  // Password reset actions
  if (action.type === requestPasswordReset.pending.type) {
    return { ...newState, loading: true, error: null };
  }
  if (action.type === requestPasswordReset.fulfilled.type) {
    return { ...newState, loading: false };
  }
  if (action.type === requestPasswordReset.rejected.type) {
    return { ...newState, loading: false, error: action.error.message || 'Password reset request failed' };
  }
  
  // Password reset confirmation
  if (action.type === confirmPasswordReset.pending.type) {
    return { ...newState, loading: true, error: null };
  }
  if (action.type === confirmPasswordReset.fulfilled.type) {
    return { ...newState, loading: false };
  }
  if (action.type === confirmPasswordReset.rejected.type) {
    return { ...newState, loading: false, error: action.payload || 'Password reset failed' };
  }
  
  // User data actions
  if (action.type === fetchUserData.pending.type) {
    return { ...newState, loading: true, error: null };
  }
  if (action.type === fetchUserData.fulfilled.type) {
    return { ...newState, loading: false, user: action.payload };
  }
  if (action.type === fetchUserData.rejected.type) {
    return { ...newState, loading: false, error: action.error.message || 'User data fetch failed' };
  }
  
  // User profile actions
  if (action.type === fetchUserProfile.pending.type) {
    return { ...newState, loading: true, error: null };
  }
  if (action.type === fetchUserProfile.fulfilled.type) {
    return { ...newState, loading: false, user: action.payload };
  }
  if (action.type === fetchUserProfile.rejected.type) {
    return { ...newState, loading: false, error: action.error.message || 'Failed to fetch user profile' };
  }
  
  // Workspace data actions
  if (action.type === fetchWorkspaceData.pending.type) {
    return { ...newState, loading: true, error: null };
  }
  if (action.type === fetchWorkspaceData.fulfilled.type) {
    return { ...newState, loading: false, user: action.payload };
  }
  if (action.type === fetchWorkspaceData.rejected.type) {
    return { ...newState, loading: false, error: action.error.message || 'Failed to fetch workspace data' };
  }
  
  // Permission actions
  if (action.type === getUserPermission.pending.type) {
    return { ...newState, loading: true, error: null };
  }
  if (action.type === getUserPermission.fulfilled.type) {
    return { ...newState, loading: false, permissions: action.payload };
  }
  if (action.type === getUserPermission.rejected.type) {
    return { ...newState, loading: false, error: action.error.message || 'User permission fetch failed' };
  }
  
  return newState;
};

// Export the reducer directly
export default authReducerWithExtraReducers;

// Re-export the action creators for use in components
export {
  loginUser,
  registerUser,
  requestPasswordReset,
  confirmPasswordReset,
  fetchUserData,
  fetchUserProfile,
  fetchWorkspaceData,
  getUserPermission
};
