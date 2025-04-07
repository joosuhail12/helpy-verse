
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { handleLogout as tokenHandleLogout } from '@/utils/auth/tokenManager';
import { AuthState } from './types';

// Define a simple initial authentication check function
// instead of importing from tokenManager to avoid circular dependency
const checkInitialAuthState = (): boolean => {
  try {
    return !!localStorage.getItem("token");
  } catch (error) {
    console.error("Error checking initial auth state:", error);
    return false;
  }
};

const initialState: AuthState = {
  isAuthenticated: checkInitialAuthState(),
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

// Export the reducer both as named export and default export for better compatibility
export const reducer = authSlice.reducer;
export default authSlice.reducer;
