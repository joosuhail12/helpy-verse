
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { handleLogout as tokenHandleLogout } from '@/utils/auth/tokenManager';
import { AuthState } from './types';

// Import isAuthenticated function directly to avoid circular dependencies
import { isAuthenticated } from '@/utils/auth/tokenManager';

const initialState: AuthState = {
  isAuthenticated: isAuthenticated(),
  user: null,
  loading: false,
  error: null,
  permissions: [],
};

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
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setAuthSuccess: (state, action: PayloadAction<any>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    setPermissions: (state, action: PayloadAction<any[]>) => {
      state.permissions = action.payload;
    },
    setUserData: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    }
  },
});

// Export the actions
export const { 
  logout, 
  clearError, 
  setAuthLoading, 
  setAuthError, 
  setAuthSuccess,
  setPermissions,
  setUserData
} = authSlice.actions;

// Export the reducer separately (not as default)
export const reducer = authSlice.reducer;
