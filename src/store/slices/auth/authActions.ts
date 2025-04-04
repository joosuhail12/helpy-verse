
import { createAsyncThunk } from '@reduxjs/toolkit';
import { HttpClient } from "@/api/services/http";
import { AuthService } from '@/services/authService';
import { WorkspaceService } from '@/services/workspaceService';
import { encryptBase64 } from '@/utils/helpers/helpers';
import { get } from "lodash";
import { 
  Credentials,
  PasswordResetConfirmation, 
  PasswordResetRequest, 
  RegistrationCredentials,
  AuthResponse
} from './types';
import { AUTH_ENDPOINTS } from '@/api/services/http/config';
import { 
  createAuthError, 
  createNetworkError, 
  createServerError,
  createTimeoutError 
} from '@/utils/error/errorTypes';
import { ErrorHandlerService } from '@/utils/error/errorHandlerService';

// Authentication actions
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: Credentials, { rejectWithValue }) => {
    try {
      // Check for offline status first
      if (HttpClient.isOffline()) {
        console.error("Device is offline - cannot connect to authentication server");
        return rejectWithValue(
          createNetworkError("You are currently offline. Please check your internet connection and try again.")
        );
      }
      
      console.log("Attempting login for:", credentials.email);
      
      // Use retry logic for login with max 2 retries
      const response = await ErrorHandlerService.retryWithBackoff(
        () => HttpClient.apiClient.post(AUTH_ENDPOINTS.LOGIN, {
          username: credentials.email,
          password: credentials.password,
          recaptchaId: "",
        }),
        2, // max retries
        1000, // base delay
        (error) => {
          // Only retry on network or server errors, not auth errors
          return !error.isAuthError && (error.isServerError || error.isOfflineError || error.isTimeoutError);
        }
      );

      console.log("Login response received:", response.status);
      
      const loginData = response.data?.data;
      if (loginData) {
        const email = loginData?.username || credentials.email;
        const encryptedEmail = encryptBase64(email);
        localStorage.setItem("agent_email", encryptedEmail);

        // Set the token using our centralized auth service
        const token = loginData?.accessToken?.token || "";
        if (token) {
          console.log("Setting token from login response");
          const tokenSet = AuthService.setAuthToken(token);
          
          if (!tokenSet) {
            return rejectWithValue(createAuthError("Failed to set authentication token"));
          }
          
          // Store user ID for convenience if available
          if (loginData.id) {
            AuthService.setUserId(loginData.id);
          }
          
          // Store user role if available
          if (loginData.role) {
            AuthService.setUserRole(loginData.role);
          }
        } else {
          console.error("No token received in login response");
          return rejectWithValue(createAuthError("Authentication server did not provide a valid token. Please try again."));
        }

        // Set workspace ID if available using our centralized workspace service
        const workspaceId = get(response.data, "data.defaultWorkspaceId", "");
        if (workspaceId) {
          WorkspaceService.setWorkspaceId(workspaceId);
        } else {
          console.warn("No workspace ID found in login response");
        }

        // Configure Axios with the new token
        HttpClient.setAxiosDefaultConfig();
      } else {
        console.error("Login response missing data structure:", response.data);
        return rejectWithValue(createServerError("Invalid server response format"));
      }
      
      return response.data;
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Check if this is an offline error
      if (error.isOfflineError || !navigator.onLine) {
        return rejectWithValue(
          createNetworkError("You are currently offline. Please check your internet connection and try again.")
        );
      }
      
      // Check if this is an auth error
      if (error.isAuthError) {
        return rejectWithValue(
          createAuthError("Invalid email or password. Please check your credentials and try again.")
        );
      }
      
      // Check if this is a server error
      if (error.isServerError) {
        return rejectWithValue(
          createServerError("The authentication server is currently unavailable. Please try again later.")
        );
      }
      
      // Check if this is a timeout error
      if (error.isTimeoutError || error.code === 'ECONNABORTED') {
        return rejectWithValue(
          createTimeoutError("Request timed out. The server is taking too long to respond.")
        );
      }
      
      // Provide more specific error messages based on the error type
      if (error.code === 'ERR_NETWORK') {
        return rejectWithValue(
          createNetworkError("Cannot connect to the authentication server. Please check your network connection or try again later.")
        );
      }
      
      // Log detailed error information for debugging
      console.error("Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      return rejectWithValue({
        message: error.response?.data?.message || "Login failed. Please check your credentials and try again.",
        code: error.response?.data?.code || error.code,
      });
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (credentials: RegistrationCredentials, { rejectWithValue }) => {
    try {
      // Use retry logic for registration
      const response = await ErrorHandlerService.retryWithBackoff(
        () => HttpClient.apiClient.post(AUTH_ENDPOINTS.REGISTER, credentials),
        2
      );
      
      // If registration returns a token, set it
      const token = get(response, 'data.data.accessToken.token', '');
      if (token) {
        // Use AuthService to set the token instead of handleSetToken directly
        AuthService.setAuthToken(token);
        
        // Set user ID if available
        const userId = get(response, 'data.data.id', '');
        if (userId) {
          AuthService.setUserId(userId);
        }
        
        // Set workspace ID if available
        const workspaceId = get(response, 'data.data.defaultWorkspaceId', '');
        if (workspaceId) {
          WorkspaceService.setWorkspaceId(workspaceId);
        }
        
        // Configure Axios with the new token
        HttpClient.setAxiosDefaultConfig();
      }
      
      return response.data;
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Handle specific registration errors
      if (error.response?.status === 409) {
        return rejectWithValue({
          message: "This email is already registered. Please use a different email or try logging in.",
          code: "EMAIL_EXISTS"
        });
      }
      
      if (error.isOfflineError || !navigator.onLine) {
        return rejectWithValue(
          createNetworkError("You are currently offline. Please check your internet connection and try again.")
        );
      }
      
      return rejectWithValue({
        message: error.response?.data?.message || "Registration failed. Please try again.",
        code: error.response?.data?.code || error.code,
      });
    }
  }
);

export const requestPasswordReset = createAsyncThunk(
  'auth/requestPasswordReset',
  async (credentials: PasswordResetRequest, { rejectWithValue }) => {
    try {
      const response = await ErrorHandlerService.retryWithBackoff(
        () => HttpClient.apiClient.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, credentials),
        2
      );
      return response.data;
    } catch (error: any) {
      console.error("Password reset request error:", error);
      
      if (error.isOfflineError || !navigator.onLine) {
        return rejectWithValue(
          createNetworkError("You are currently offline. Please check your internet connection and try again.")
        );
      }
      
      // Even if email doesn't exist, we don't want to reveal that information
      // for security reasons, so we return a generic success message
      if (error.response?.status === 404) {
        return {
          status: "success",
          message: "If an account exists with this email, reset instructions have been sent."
        };
      }
      
      return rejectWithValue({
        message: error.response?.data?.message || 'Password reset request failed. Please try again.',
        code: error.response?.data?.code || error.code,
      });
    }
  }
);

export const confirmPasswordReset = createAsyncThunk(
  'auth/confirmPasswordReset',
  async (credentials: PasswordResetConfirmation, { rejectWithValue }) => {
    try {
      const response = await ErrorHandlerService.retryWithBackoff(
        () => HttpClient.apiClient.post(AUTH_ENDPOINTS.RESET_PASSWORD, credentials),
        2
      );
      return response.data;
    } catch (error: any) {
      console.error("Password reset confirmation error:", error);
      
      if (error.isOfflineError || !navigator.onLine) {
        return rejectWithValue(
          createNetworkError("You are currently offline. Please check your internet connection and try again.")
        );
      }
      
      if (error.response?.status === 400) {
        return rejectWithValue({
          message: "The reset link is invalid or has expired. Please request a new password reset.",
          code: "INVALID_TOKEN"
        });
      }
      
      return rejectWithValue({
        message: error.response?.data?.message || 'Password reset failed. Please try again.',
        code: error.response?.data?.code || error.code,
      });
    }
  }
);

// Refresh token
export const refreshAuthToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      // Use the refresh token endpoint
      const response = await HttpClient.apiClient.post(AUTH_ENDPOINTS.REFRESH_TOKEN);
      
      const newToken = get(response, 'data.data.accessToken.token', '');
      if (newToken) {
        AuthService.setAuthToken(newToken);
        HttpClient.setAxiosDefaultConfig();
        console.log("Token refreshed successfully");
      } else {
        console.error("No token received in refresh response");
        return rejectWithValue(createAuthError("Failed to refresh authentication token"));
      }
      
      return response.data;
    } catch (error: any) {
      console.error("Token refresh error:", error);
      
      // If refresh fails, redirect to login
      if (error.response?.status === 401 || error.response?.status === 403) {
        AuthService.logout();
      }
      
      return rejectWithValue({
        message: error.response?.data?.message || "Session expired. Please sign in again.",
        code: error.response?.data?.code || error.code,
      });
    }
  }
);
