
import { createAsyncThunk } from '@reduxjs/toolkit';
import { HttpClient } from "@/api/services/http";
import { 
  encryptBase64,
  setCookie,
  setWorkspaceId,
  handleSetToken
} from '@/utils/helpers/helpers';
import { get } from "lodash";
import { Credentials, PasswordResetConfirmation, PasswordResetRequest, RegistrationCredentials } from './types';
import { AUTH_ENDPOINTS } from '@/api/services/http/config';

// Authentication actions

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: Credentials, { rejectWithValue }) => {
    try {
      // Check for offline status first
      if (HttpClient.isOffline()) {
        console.error("Device is offline - cannot connect to authentication server");
        return rejectWithValue({
          message: "You are currently offline. Please check your internet connection and try again.",
          isOfflineError: true
        });
      }
      
      console.log("Attempting login for:", credentials.email);
      
      // Ensure we're using the consistent endpoint from config
      const response = await HttpClient.apiClient.post(AUTH_ENDPOINTS.LOGIN, {
        username: credentials.email,
        password: credentials.password,
        recaptchaId: "",
      });

      console.log("Login response received:", response.status);
      
      const loginData = response.data ? response.data.data : null;
      if (loginData) {
        const email = loginData?.username || credentials.email;
        const encryptedEmail = encryptBase64(email);
        setCookie("agent_email", encryptedEmail);

        // Set the token in the cookie and Axios headers
        const token = loginData?.accessToken?.token || "";
        if (token) {
          console.log("Setting token from login response");
          handleSetToken(token);
          
          // Store user ID for convenience if available
          if (loginData.id) {
            localStorage.setItem("userId", loginData.id);
          }
          
          // Store user role if available
          if (loginData.role) {
            localStorage.setItem("role", loginData.role);
          }
        } else {
          console.error("No token received in login response");
          return rejectWithValue("Authentication server did not provide a valid token. Please try again.");
        }

        // Set workspace ID if available - only in cookie
        const workspaceId = loginData.defaultWorkspaceId || "";
        if (workspaceId) {
          setWorkspaceId(workspaceId);
        }

        // Configure Axios with the new token
        HttpClient.setAxiosDefaultConfig();
      } else {
        console.error("Login response missing data structure:", response.data);
        return rejectWithValue("Invalid server response format");
      }
      
      return response.data;
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Check if this is an offline error
      if (error.isOfflineError || !navigator.onLine) {
        return rejectWithValue({
          message: "You are currently offline. Please check your internet connection and try again.",
          isOfflineError: true
        });
      }
      
      // Check if this is an auth error
      if (error.isAuthError) {
        return rejectWithValue({
          message: "Invalid email or password. Please check your credentials and try again.",
          isAuthError: true
        });
      }
      
      // Check if this is a server error
      if (error.isServerError) {
        return rejectWithValue({
          message: "The authentication server is currently unavailable. Please try again later.",
          isServerError: true
        });
      }
      
      // Provide more specific error messages based on the error type
      if (error.code === 'ERR_NETWORK') {
        return rejectWithValue({
          message: "Cannot connect to the authentication server. Please check your network connection or try again later.",
          isOfflineError: true
        });
      }
      
      // Log detailed error information for debugging
      console.error("Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      return rejectWithValue(error.response?.data?.message || "Login failed. Please check your credentials and try again.");
    }
  }
);

// Implement other auth actions
export const registerUser = createAsyncThunk(
  'auth/register',
  async (credentials: RegistrationCredentials, { rejectWithValue }) => {
    try {
      // Placeholder until API is available
      console.log("Register user:", credentials);
      return { success: true };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
  }
);

export const requestPasswordReset = createAsyncThunk(
  'auth/requestPasswordReset',
  async (credentials: PasswordResetRequest, { rejectWithValue }) => {
    try {
      // Placeholder until API is available
      console.log("Password reset for:", credentials);
      return { success: true };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Password reset request failed');
    }
  }
);

export const confirmPasswordReset = createAsyncThunk(
  'auth/confirmPasswordReset',
  async (credentials: PasswordResetConfirmation, { rejectWithValue }) => {
    try {
      // Placeholder until API is available
      console.log("Confirm password reset:", credentials);
      return { success: true };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Password reset failed');
    }
  }
);

export const fetchUserData = createAsyncThunk(
  'auth/fetchUserData',
  async (_, { rejectWithValue }) => {
    try {
      // Placeholder until API is available
      return { id: '1', name: 'User', email: 'user@example.com' };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user data');
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      // Placeholder until API is available
      return { id: '1', name: 'User', email: 'user@example.com' };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user profile');
    }
  }
);

export const fetchWorkspaceData = createAsyncThunk(
  'auth/fetchWorkspaceData',
  async (_, { rejectWithValue }) => {
    try {
      // Placeholder until API is available
      return { id: '1', name: 'Workspace' };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch workspace data');
    }
  }
);

export const getUserPermission = createAsyncThunk(
  'auth/getUserPermission',
  async (_, { rejectWithValue }) => {
    try {
      // Placeholder until API is available
      return [{ action: 'read', subject: 'dashboard' }];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user permissions');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Placeholder until API is available
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
      return { success: true };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);
