import { createSlice } from '@reduxjs/toolkit';
import { AuthService } from '@/services/authService';
import { AuthState } from './types';
import { 
  loginUser, 
  registerUser, 
  requestPasswordReset, 
  confirmPasswordReset,
  refreshAuthToken
} from './authActions';
import { 
  fetchUserData, 
  fetchUserProfile, 
  fetchWorkspaceData 
} from './userActions';
import { getUserPermission } from './permissionActions';
import { toast } from '@/components/ui/use-toast';
import { 
  isAuthError, 
  isNetworkError, 
  isServerError,
  isTimeoutError
} from '@/utils/error/errorTypes';

const initialState: AuthState = {
  isAuthenticated: AuthService.isAuthenticated(),
  user: null,
  loading: false,
  error: null,
  permissions: [],
  workspaces: [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      state.permissions = [];
      state.workspaces = [];
      // Call the improved auth service logout function
      AuthService.logout();
    },
    clearError: (state) => {
      state.error = null;
    },
    setWorkspaces: (state, action) => {
      state.workspaces = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login actions
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        
        // Show success message
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        
        // Extract the error payload
        const payload = action.payload as any;
        
        // Determine error message to display
        let errorMessage = 'Login failed. Please try again.';
        
        if (payload) {
          if (isAuthError(payload)) {
            errorMessage = payload.message;
          } else if (isNetworkError(payload)) {
            errorMessage = payload.message;
          } else if (isServerError(payload)) {
            errorMessage = payload.message;
          } else if (isTimeoutError(payload)) {
            errorMessage = payload.message;
          } else if (typeof payload === 'object' && payload.message) {
            errorMessage = payload.message;
          }
        }
        
        state.error = {
          message: errorMessage,
          code: payload?.code,
          isOfflineError: isNetworkError(payload),
          isAuthError: isAuthError(payload),
          isServerError: isServerError(payload),
          isTimeoutError: isTimeoutError(payload)
        };
        
        // Show error toast
        toast({
          title: "Login Error",
          description: errorMessage,
          variant: "destructive",
        });
      })
      
      // Password reset actions
      .addCase(requestPasswordReset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state, action) => {
        state.loading = false;
        
        // Show success message
        toast({
          title: "Password Reset",
          description: "If an account exists with this email, reset instructions have been sent.",
        });
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.loading = false;
        
        const payload = action.payload as any;
        
        state.error = typeof payload === 'object' ? payload : {
          message: action.error.message || 'Password reset request failed'
        };
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
        
        // Show success message
        toast({
          title: "Account Created",
          description: "Your account has been successfully created.",
        });
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        
        const payload = action.payload as any;
        const errorMessage = payload?.message || action.error.message || 'Registration failed';
        
        state.error = {
          message: errorMessage,
          code: payload?.code,
          isOfflineError: isNetworkError(payload),
          isAuthError: isAuthError(payload),
          isServerError: isServerError(payload),
        };
        
        // Show error toast
        toast({
          title: "Registration Error",
          description: errorMessage,
          variant: "destructive",
        });
      })
      
      // User data actions
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) {
          // Merge profile data into existing user data
          state.user = {
            ...state.user,
            data: {
              ...state.user.data,
              profile: action.payload?.data?.profile || state.user.data.profile
            }
          };
        } else {
          state.user = action.payload;
        }
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        
        const payload = action.payload as any;
        const errorMessage = payload?.message || action.error.message || 'Failed to fetch user data';
        
        state.error = {
          message: errorMessage,
          code: payload?.code,
          isOfflineError: isNetworkError(payload),
          isAuthError: isAuthError(payload),
          isServerError: isServerError(payload),
        };
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
        
        const payload = action.payload as any;
        const errorMessage = payload?.message || action.error.message || 'Failed to fetch user permissions';
        
        state.error = {
          message: errorMessage,
          code: payload?.code,
        };
      })
      
      // Profile actions
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) {
          // Merge profile data into existing user data
          state.user = {
            ...state.user,
            data: {
              ...state.user.data,
              profile: action.payload?.data?.profile || action.payload?.data
            }
          };
        } else {
          state.user = action.payload;
        }
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        
        const payload = action.payload as any;
        const errorMessage = payload?.message || action.error.message || 'Failed to fetch user profile';
        
        state.error = {
          message: errorMessage,
          code: payload?.code,
        };
      })
      
      // Workspace actions
      .addCase(fetchWorkspaceData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkspaceData.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) {
          // Save workspace data
          state.user = {
            ...state.user,
            data: {
              ...state.user.data,
              currentWorkspace: action.payload?.data
            }
          };
        } else {
          state.user = action.payload;
        }
      })
      .addCase(fetchWorkspaceData.rejected, (state, action) => {
        state.loading = false;
        
        const payload = action.payload as any;
        const errorMessage = payload?.message || action.error.message || 'Failed to fetch workspace data';
        
        state.error = {
          message: errorMessage,
          code: payload?.code,
        };
      })
      
      // Password reset confirmation cases
      .addCase(confirmPasswordReset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmPasswordReset.fulfilled, (state) => {
        state.loading = false;
        
        // Show success message
        toast({
          title: "Password Reset Successful",
          description: "Your password has been successfully reset. You can now log in with your new password.",
        });
      })
      .addCase(confirmPasswordReset.rejected, (state, action) => {
        state.loading = false;
        
        const payload = action.payload as any;
        const errorMessage = payload?.message || action.error.message || 'Password reset failed';
        
        state.error = {
          message: errorMessage,
          code: payload?.code,
        };
        
        // Show error toast
        toast({
          title: "Password Reset Failed",
          description: errorMessage,
          variant: "destructive",
        });
      })
      
      // Token refresh cases
      .addCase(refreshAuthToken.pending, (state) => {
        // Don't set loading to true to prevent UI flicker during background refresh
        state.error = null;
      })
      .addCase(refreshAuthToken.fulfilled, (state, action) => {
        // Update token info
        if (state.user && action.payload?.data?.accessToken) {
          state.user = {
            ...state.user,
            data: {
              ...state.user.data,
              accessToken: action.payload.data.accessToken
            }
          };
        }
      })
      .addCase(refreshAuthToken.rejected, (state, action) => {
        // Handle token refresh failure (typically this will trigger logout)
        const payload = action.payload as any;
        const errorMessage = payload?.message || action.error.message || 'Failed to refresh authentication';
        
        console.error('Token refresh failed:', errorMessage);
        
        // Only set error for real failures, not for background refreshes
        if (payload?.code !== 'TOKEN_REFRESH_BACKGROUND') {
          state.error = {
            message: errorMessage,
            code: payload?.code,
            isAuthError: true
          };
        }
      });
  },
});

export const { logout, clearError, setWorkspaces } = authSlice.actions;

// Re-export all the actions for use in components
export {
  loginUser,
  registerUser,
  requestPasswordReset,
  confirmPasswordReset,
  refreshAuthToken,
  fetchUserData,
  fetchUserProfile,
  fetchWorkspaceData,
  getUserPermission
};

export default authSlice.reducer;
