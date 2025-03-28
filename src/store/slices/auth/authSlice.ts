
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

// Create the slice with a simple reducer first
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
  // We'll add the extraReducers after we import the action creators
  extraReducers: (builder) => {
    // The builder callback will be populated after we import all action creators
  },
});

// Export actions from the slice
export const { logout, clearError } = authSlice.actions;

// Import the action creators AFTER creating the slice (but before adding the extra reducers)
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

// Now we can add the extraReducers manually
const authReducer = authSlice.reducer;

// Define a new reducer that wraps the original one and adds the extra cases
const enhancedAuthReducer = (state = initialState, action: any) => {
  // Handle login actions
  if (action.type === loginUser.pending.type) {
    return {
      ...state,
      loading: true,
      error: null,
    };
  }
  if (action.type === loginUser.fulfilled.type) {
    return {
      ...state,
      loading: false,
      isAuthenticated: true,
      user: action.payload,
    };
  }
  if (action.type === loginUser.rejected.type) {
    return {
      ...state,
      loading: false,
      error: action.error.message || 'Login failed',
    };
  }

  // Handle register actions
  if (action.type === registerUser.pending.type) {
    return {
      ...state,
      loading: true,
      error: null,
    };
  }
  if (action.type === registerUser.fulfilled.type) {
    return {
      ...state,
      loading: false,
      isAuthenticated: true,
      user: action.payload,
    };
  }
  if (action.type === registerUser.rejected.type) {
    return {
      ...state,
      loading: false,
      error: action.error.message || 'Registration failed',
    };
  }

  // Handle password reset actions
  if (action.type === requestPasswordReset.pending.type) {
    return {
      ...state,
      loading: true,
      error: null,
    };
  }
  if (action.type === requestPasswordReset.fulfilled.type) {
    return {
      ...state,
      loading: false,
    };
  }
  if (action.type === requestPasswordReset.rejected.type) {
    return {
      ...state,
      loading: false,
      error: action.error.message || 'Password reset request failed',
    };
  }

  // Handle password reset confirmation
  if (action.type === confirmPasswordReset.pending.type) {
    return {
      ...state,
      loading: true,
      error: null,
    };
  }
  if (action.type === confirmPasswordReset.fulfilled.type) {
    return {
      ...state,
      loading: false,
    };
  }
  if (action.type === confirmPasswordReset.rejected.type) {
    return {
      ...state,
      loading: false,
      error: action.payload as string || 'Password reset failed',
    };
  }

  // Handle user data actions
  if (action.type === fetchUserData.pending.type) {
    return {
      ...state,
      loading: true,
      error: null,
    };
  }
  if (action.type === fetchUserData.fulfilled.type) {
    return {
      ...state,
      loading: false,
      user: action.payload,
    };
  }
  if (action.type === fetchUserData.rejected.type) {
    return {
      ...state,
      loading: false,
      error: action.error.message || 'User data fetch failed',
    };
  }

  // Handle user profile actions
  if (action.type === fetchUserProfile.pending.type) {
    return {
      ...state,
      loading: true,
      error: null,
    };
  }
  if (action.type === fetchUserProfile.fulfilled.type) {
    return {
      ...state,
      loading: false,
      user: action.payload,
    };
  }
  if (action.type === fetchUserProfile.rejected.type) {
    return {
      ...state,
      loading: false,
      error: action.error.message || 'Failed to fetch user profile',
    };
  }

  // Handle workspace data actions
  if (action.type === fetchWorkspaceData.pending.type) {
    return {
      ...state,
      loading: true,
      error: null,
    };
  }
  if (action.type === fetchWorkspaceData.fulfilled.type) {
    return {
      ...state,
      loading: false,
      user: action.payload,
    };
  }
  if (action.type === fetchWorkspaceData.rejected.type) {
    return {
      ...state,
      loading: false,
      error: action.error.message || 'Failed to fetch workspace data',
    };
  }

  // Handle permission actions
  if (action.type === getUserPermission.pending.type) {
    return {
      ...state,
      loading: true,
      error: null,
    };
  }
  if (action.type === getUserPermission.fulfilled.type) {
    return {
      ...state,
      loading: false,
      permissions: action.payload,
    };
  }
  if (action.type === getUserPermission.rejected.type) {
    return {
      ...state,
      loading: false,
      error: action.error.message || 'User permission fetch failed',
    };
  }

  // For all other actions, use the original reducer
  return authReducer(state, action);
};

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

export default enhancedAuthReducer;
