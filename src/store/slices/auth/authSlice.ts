import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
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
import { toast } from '@/components/ui/use-toast';
import { 
  isAuthError, 
  isNetworkError, 
  isServerError,
  isTimeoutError
} from '@/utils/error/errorTypes';
import { HttpClient } from '@/api/services/http';

export const getUserPermission = createAsyncThunk(
  'auth/getUserPermission',
  async (_, { rejectWithValue }) => {
    try {
      const response = await HttpClient.apiClient.get("/profile/abilities");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch user permissions");
    }
  }
);

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
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        
        const payload = action.payload as any;
        
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
        
        toast({
          title: "Login Error",
          description: errorMessage,
          variant: "destructive",
        });
      })
      
      .addCase(requestPasswordReset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state, action) => {
        state.loading = false;
        
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
      
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        
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
        
        toast({
          title: "Registration Error",
          description: errorMessage,
          variant: "destructive",
        });
      })
      
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) {
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
      
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) {
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
      
      .addCase(fetchWorkspaceData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkspaceData.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) {
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
      
      .addCase(confirmPasswordReset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmPasswordReset.fulfilled, (state) => {
        state.loading = false;
        
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
        
        toast({
          title: "Password Reset Failed",
          description: errorMessage,
          variant: "destructive",
        });
      })
      
      .addCase(refreshAuthToken.pending, (state) => {
        state.error = null;
      })
      .addCase(refreshAuthToken.fulfilled, (state, action) => {
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
        const payload = action.payload as any;
        const errorMessage = payload?.message || action.error.message || 'Failed to refresh authentication';
        
        console.error('Token refresh failed:', errorMessage);
        
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

export {
  loginUser,
  registerUser,
  requestPasswordReset,
  confirmPasswordReset,
  refreshAuthToken,
  fetchUserData,
  fetchUserProfile,
  fetchWorkspaceData
};

export default authSlice.reducer;
