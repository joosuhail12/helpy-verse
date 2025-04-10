
import { createAsyncThunk } from '@reduxjs/toolkit';
import { HttpClient } from "@/api/services/http";
import { AUTH_ENDPOINTS } from '@/api/services/http/config';
import { 
  setAuthLoading, 
  setAuthError, 
  setAuthSuccess, 
  setUserData 
} from './authSlice';
import { get } from "lodash";
import type { Credentials, PasswordResetConfirmation, PasswordResetRequest, RegistrationCredentials } from './types';
import type { AppDispatch, RootState } from '@/store/store';

// Create encryptBase64 function here to avoid circular dependencies
const encryptBase64 = (text: string): string => {
  return window.btoa(unescape(encodeURIComponent(text)));
};

// Create setToken helper to avoid circular dependencies
const setToken = (token: string): boolean => {
  if (!token) return false;
  
  try {
    localStorage.setItem("token", token);
    return true;
  } catch (e) {
    console.error("Failed to set token:", e);
    return false;
  }
};

// Create setWorkspaceId helper to avoid circular dependencies
const setWorkspaceId = (id: string): void => {
  if (id) {
    localStorage.setItem("workspaceId", id);
  }
};

// Create action creator functions that dispatch the slice actions
export const loginUser = (credentials: Credentials) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setAuthLoading(true));
    
    // Check for offline status first
    if (!navigator.onLine) {
      console.error("Device is offline - cannot connect to authentication server");
      dispatch(setAuthError("You are currently offline. Please check your internet connection and try again."));
      return {
        error: {
          message: "You are currently offline. Please check your internet connection and try again.",
          isOfflineError: true
        }
      };
    }
    
    console.log("Attempting login for:", credentials.email);
    
    // Ensure we're using the consistent endpoint from config
    const response = await HttpClient.apiClient.post(AUTH_ENDPOINTS.LOGIN, {
      username: credentials.email,
      password: credentials.password,
      recaptchaId: "",
    });

    console.log("Login response received:", response.status);
    
    const loginData = response.data?.data;
    if (loginData) {
      const email = loginData?.username || credentials.email;
      const encryptedEmail = encryptBase64(email);
      localStorage.setItem("agent_email", encryptedEmail);

      // Set the token in the localStorage and Axios headers
      const token = loginData?.accessToken?.token || "";
      if (token) {
        console.log("Setting token from login response");
        setToken(token);
        
        // Configure Axios with the new token
        if (HttpClient && HttpClient.setAxiosDefaultConfig) {
          HttpClient.setAxiosDefaultConfig(token);
        }
        
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
        dispatch(setAuthError("Authentication server did not provide a valid token. Please try again."));
        return { error: { message: "Authentication server did not provide a valid token. Please try again." } };
      }

      // Set workspace ID if available
      const workspaceId = get(response.data, "data.defaultWorkspaceId", "");
      if (workspaceId) {
        setWorkspaceId(workspaceId);
      }
      
      dispatch(setAuthSuccess(response.data));
      return { data: response.data };
    } else {
      console.error("Login response missing data structure:", response.data);
      dispatch(setAuthError("Invalid server response format"));
      return { error: { message: "Invalid server response format" } };
    }
  } catch (error: any) {
    console.error("Login error:", error);
    
    let errorMessage = "Login failed. Please check your credentials and try again.";
    let errorDetails = {};
    
    // Check if this is an offline error
    if (!navigator.onLine) {
      errorMessage = "You are currently offline. Please check your internet connection and try again.";
      errorDetails = { isOfflineError: true };
    }
    // Check if this is an auth error
    else if (error.isAuthError) {
      errorMessage = "Invalid email or password. Please check your credentials and try again.";
      errorDetails = { isAuthError: true };
    }
    // Check if this is a server error
    else if (error.isServerError) {
      errorMessage = "The authentication server is currently unavailable. Please try again later.";
      errorDetails = { isServerError: true };
    }
    // Provide more specific error messages based on the error type
    else if (error.code === 'ERR_NETWORK') {
      errorMessage = "Cannot connect to the authentication server. Please check your network connection or try again later.";
      errorDetails = { isOfflineError: true };
    }
    else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    dispatch(setAuthError(errorMessage));
    return { 
      error: {
        message: errorMessage,
        ...errorDetails,
        details: {
          status: error.response?.status,
          data: error.response?.data
        }
      }
    };
  }
};

export const registerUser = (credentials: RegistrationCredentials) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setAuthLoading(true));
    
    const response = await HttpClient.apiClient.post(AUTH_ENDPOINTS.REGISTER, credentials);
    
    // If registration returns a token, set it
    const token = get(response, 'data.data.accessToken.token', '');
    if (token) {
      setToken(token); // Using our local setToken function instead of handleSetToken
    }
    
    dispatch(setAuthSuccess(response.data));
    return { data: response.data };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Registration failed";
    dispatch(setAuthError(errorMessage));
    return { error: { message: errorMessage } };
  }
};

export const requestPasswordReset = (credentials: PasswordResetRequest) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setAuthLoading(true));
    
    const response = await HttpClient.apiClient.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, credentials);
    
    dispatch(setAuthLoading(false));
    return { data: response.data };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Password reset request failed';
    dispatch(setAuthError(errorMessage));
    return { error: { message: errorMessage } };
  }
};

export const confirmPasswordReset = (credentials: PasswordResetConfirmation) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setAuthLoading(true));
    
    const response = await HttpClient.apiClient.post(AUTH_ENDPOINTS.RESET_PASSWORD, credentials);
    
    dispatch(setAuthLoading(false));
    return { data: response.data };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Password reset failed';
    dispatch(setAuthError(errorMessage));
    return { error: { message: errorMessage } };
  }
};

// Legacy thunk versions for backward compatibility
export const loginUserThunk = createAsyncThunk(
  "auth/login",
  async (credentials: Credentials, { rejectWithValue, dispatch }) => {
    const result = await loginUser(credentials)(dispatch as AppDispatch);
    if (result.error) return rejectWithValue(result.error);
    return result.data;
  }
);

export const registerUserThunk = createAsyncThunk(
  'auth/register',
  async (credentials: RegistrationCredentials, { rejectWithValue, dispatch }) => {
    const result = await registerUser(credentials)(dispatch as AppDispatch);
    if (result.error) return rejectWithValue(result.error);
    return result.data;
  }
);

export const requestPasswordResetThunk = createAsyncThunk(
  'auth/requestPasswordReset',
  async (credentials: PasswordResetRequest, { rejectWithValue, dispatch }) => {
    const result = await requestPasswordReset(credentials)(dispatch as AppDispatch);
    if (result.error) return rejectWithValue(result.error);
    return result.data;
  }
);

export const confirmPasswordResetThunk = createAsyncThunk(
  'auth/confirmPasswordReset',
  async (credentials: PasswordResetConfirmation, { rejectWithValue, dispatch }) => {
    const result = await confirmPasswordReset(credentials)(dispatch as AppDispatch);
    if (result.error) return rejectWithValue(result.error);
    return result.data;
  }
);
