
import { createSlice } from '@reduxjs/toolkit';
import { fetchUserData, fetchUserProfile, fetchWorkspaceData, getUserPermission, loginUser, logout } from './authActions';

export type Permission = {
  action: string;
  subject: string;
  conditions?: Record<string, any>;
};

export type Permissions = Permission[];

export interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  user: any | null;
  token: string | null;
  workspaceData: any | null;
  permissions: Permissions;
}

const initialState: AuthState = {
  isAuthenticated: false,
  loading: false,
  error: null,
  user: null,
  token: null,
  workspaceData: null,
  permissions: [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.error = null;
      // Additional user data might be handled here
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload as string || 'Login failed';
    });

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      return initialState;
    });

    // Fetch user data
    builder.addCase(fetchUserData.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchUserData.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(fetchUserData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string || 'Failed to fetch user data';
    });

    // Get user profile
    builder.addCase(fetchUserProfile.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(fetchUserProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string || 'Failed to fetch user profile';
    });

    // Get workspace data
    builder.addCase(fetchWorkspaceData.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchWorkspaceData.fulfilled, (state, action) => {
      state.loading = false;
      state.workspaceData = action.payload;
    });
    builder.addCase(fetchWorkspaceData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string || 'Failed to fetch workspace data';
    });

    // Get user permissions
    builder.addCase(getUserPermission.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getUserPermission.fulfilled, (state, action) => {
      state.loading = false;
      state.permissions = action.payload;
    });
    builder.addCase(getUserPermission.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string || 'Failed to fetch user permissions';
    });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
