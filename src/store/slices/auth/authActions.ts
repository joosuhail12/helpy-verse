
import { createAsyncThunk } from '@reduxjs/toolkit';
import { HttpClient } from "@/api/services/HttpClient";
import { 
  encryptBase64,
  setCookie,
  setWorkspaceId,
  handleSetToken
} from '@/utils/helpers/helpers';
import { get } from "lodash";
import { Credentials, PasswordResetConfirmation, PasswordResetRequest, RegistrationCredentials } from './types';

// Authentication actions

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: Credentials, { rejectWithValue }) => {
    try {
      console.log("Attempting login for:", credentials.email);
      
      // Make sure to use the correct endpoint and payload structure
      const response = await HttpClient.apiClient.post("/auth/login", {
        username: credentials.email,
        password: credentials.password,
        recaptchaId: "",
      });

      console.log("Login successful, received token");
      
      const loginData = response.data?.data;
      if (loginData) {
        const email = loginData?.username || "";
        const encryptedEmail = encryptBase64(email);
        setCookie("agent_email", encryptedEmail);

        // Set the token in the cookie and Axios headers
        handleSetToken(loginData?.accessToken?.token || "");

        // Set workspace ID
        setWorkspaceId(get(response.data, "data.defaultWorkspaceId", ""));

        // Configure Axios with the new token
        HttpClient.setAxiosDefaultConfig();
      }
      
      return response.data;
    } catch (error: any) {
      console.error("Login error:", error.message);
      // Provide more specific error messages based on the error type
      if (error.code === 'ERR_NETWORK') {
        return rejectWithValue("Cannot connect to the server. Please check your network connection or try again later.");
      }
      return rejectWithValue(error.response?.data?.message || "Login failed. Please check your credentials and try again.");
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (credentials: RegistrationCredentials, { rejectWithValue }) => {
    try {
      const response = await HttpClient.apiClient.post('/auth/register', credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
  }
);

export const requestPasswordReset = createAsyncThunk(
  'auth/requestPasswordReset',
  async (credentials: PasswordResetRequest, { rejectWithValue }) => {
    try {
      const response = await HttpClient.apiClient.post('/auth/forgot-password', credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Password reset request failed');
    }
  }
);

export const confirmPasswordReset = createAsyncThunk(
  'auth/confirmPasswordReset',
  async (credentials: PasswordResetConfirmation, { rejectWithValue }) => {
    try {
      const response = await HttpClient.apiClient.post('/auth/reset-password', credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Password reset failed');
    }
  }
);
