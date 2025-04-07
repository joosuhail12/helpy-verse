
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthState } from './types';

// Define the initial state
const initialState: AuthState = {
  isAuthenticated: false,
  loading: false,
  error: null,
  user: null,
  permissions: {
    can: [],
    cannot: [],
  },
  success: false
};

// Create the auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setAuthSuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
    },
    setUserData: (state, action: PayloadAction<AuthState['user']>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.permissions = {
        can: [],
        cannot: [],
      };
    },
    clearError: (state) => {
      state.error = null;
    },
    setPermissions: (state, action: PayloadAction<AuthState['permissions']>) => {
      state.permissions = action.payload;
    }
  },
});

// Export the actions
export const {
  setAuthLoading,
  setAuthError,
  setAuthSuccess,
  setUserData,
  logout,
  clearError,
  setPermissions
} = authSlice.actions;

// Export the reducer
export const authReducer = authSlice.reducer;
export default authSlice.reducer;
