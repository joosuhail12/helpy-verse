
import { createSlice } from '@reduxjs/toolkit';
import { getCookie } from '@/utils/helpers/helpers';
import { handleLogout as tokenHandleLogout } from '@/utils/auth/tokenManager';
import { AuthState } from './types';

// Import all the action creators first
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

const initialState: AuthState = {
  isAuthenticated: !!getCookie("customerToken"),
  user: null,
  loading: false,
  error: null,
  permissions: [],
};

// Create the slice with a separate extraReducers function to avoid temporal dead zone issues
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
  extraReducers: (builder) => {
    // Login actions
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Login failed';
    });
    
    // Password reset actions
    builder.addCase(requestPasswordReset.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(requestPasswordReset.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(requestPasswordReset.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Password reset request failed';
    });
    
    // Register actions
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Registration failed';
    });
    
    // User data actions
    builder.addCase(fetchUserData.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserData.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(fetchUserData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'User data fetch failed';
    });
    
    // Permission actions
    builder.addCase(getUserPermission.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getUserPermission.fulfilled, (state, action) => {
      state.loading = false;
      state.permissions = action.payload;
    });
    builder.addCase(getUserPermission.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'User permission fetch failed';
    });
    
    // Profile actions
    builder.addCase(fetchUserProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(fetchUserProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch user profile';
    });
    
    // Workspace actions
    builder.addCase(fetchWorkspaceData.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchWorkspaceData.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(fetchWorkspaceData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch workspace data';
    });
    
    // Password reset confirmation cases
    builder.addCase(confirmPasswordReset.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(confirmPasswordReset.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(confirmPasswordReset.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string || 'Password reset failed';
    });
  },
});

export const { logout, clearError } = authSlice.actions;

// Re-export all the actions for use in components
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

export default authSlice.reducer;
