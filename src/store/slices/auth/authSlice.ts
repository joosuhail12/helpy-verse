
import { createSlice } from '@reduxjs/toolkit';
import { getCookie } from '@/utils/helpers/helpers';
import { handleLogout as tokenHandleLogout } from '@/utils/auth/tokenManager';
import { AuthState } from './types';

// Import the action creators BEFORE creating the slice
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

// Define the initial state
const initialState: AuthState = {
  isAuthenticated: !!getCookie("customerToken"),
  user: null,
  loading: false,
  error: null,
  permissions: [],
};

// Create the slice with reducers first
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
  // Now we can safely add the extraReducers using builder
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

    // Password reset confirmation
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

    // User profile actions
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

    // Workspace data actions
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
  },
});

// Export actions from the slice
export const { logout, clearError } = authSlice.actions;

// Export the reducer directly
export default authSlice.reducer;

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
