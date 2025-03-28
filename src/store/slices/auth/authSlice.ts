
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getCookie } from '@/utils/helpers/helpers';
import { handleLogout as tokenHandleLogout } from '@/utils/auth/tokenManager';
import { AuthState } from './types';

// First import all action creators to use them later
import { 
  loginUser, 
  registerUser, 
  requestPasswordReset, 
  confirmPasswordReset 
} from './authActions';

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
  extraReducers: (builder) => {
    // Login actions
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      
      // Register actions
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      })
      
      // Password reset actions
      .addCase(requestPasswordReset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Password reset request failed';
      })
      
      // Password reset confirmation
      .addCase(confirmPasswordReset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmPasswordReset.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(confirmPasswordReset.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Password reset failed';
      })
      
      // Permission actions
      .addCase(getUserPermission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserPermission.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions = action.payload;
      })
      .addCase(getUserPermission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'User permission fetch failed';
      });
  }
});

// Import user actions only after slice is defined, to prevent circular reference
import { 
  fetchUserData, 
  fetchUserProfile, 
  fetchWorkspaceData 
} from './userActions';

// Create a separate extraReducers function for user actions
const addUserActionsToReducer = (builder: any) => {
  builder
    // User data actions
    .addCase(fetchUserData.pending, (state: AuthState) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchUserData.fulfilled, (state: AuthState, action: PayloadAction<any>) => {
      state.loading = false;
      state.user = action.payload;
    })
    .addCase(fetchUserData.rejected, (state: AuthState, action: any) => {
      state.loading = false;
      state.error = action.error.message || 'User data fetch failed';
    })
    
    // User profile actions
    .addCase(fetchUserProfile.pending, (state: AuthState) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchUserProfile.fulfilled, (state: AuthState, action: PayloadAction<any>) => {
      state.loading = false;
      state.user = action.payload;
    })
    .addCase(fetchUserProfile.rejected, (state: AuthState, action: any) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch user profile';
    })
    
    // Workspace data actions
    .addCase(fetchWorkspaceData.pending, (state: AuthState) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchWorkspaceData.fulfilled, (state: AuthState, action: PayloadAction<any>) => {
      state.loading = false;
      state.user = action.payload;
    })
    .addCase(fetchWorkspaceData.rejected, (state: AuthState, action: any) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch workspace data';
    });
};

// Get the original reducer
const authReducer = authSlice.reducer;

// Create an enhanced reducer that also handles the user actions
const enhancedAuthReducer = (state = initialState, action: any) => {
  // First run the original reducer
  let newState = authReducer(state, action);
  
  // Then run the temporary builder for user actions if needed
  if (
    action.type?.startsWith('user/') || 
    action.type?.startsWith('auth/fetchUserProfile') || 
    action.type?.startsWith('auth/fetchWorkspaceData')
  ) {
    // Run the builder with a mock builder that directly updates the state
    const mockBuilder = {
      addCase: (actionCreator: any, reducer: any) => {
        if (actionCreator.type === action.type) {
          newState = reducer(newState, action);
        }
        return mockBuilder;
      }
    };
    
    addUserActionsToReducer(mockBuilder);
  }
  
  return newState;
};

// Export actions from the slice
export const { logout, clearError } = authSlice.actions;

// Export the enhanced reducer
export default enhancedAuthReducer;

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
