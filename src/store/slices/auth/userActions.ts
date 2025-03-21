
import { createAsyncThunk } from '@reduxjs/toolkit';
import { HttpClient, cookieFunctions } from "@/api/services/http";
import { AUTH_ENDPOINTS } from "@/api/services/http/config";

export const fetchUserData = createAsyncThunk(
  "user/fetchData",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching user profile data");
      const response = await HttpClient.apiClient.get(AUTH_ENDPOINTS.USER_PROFILE);
      console.log("User profile data fetched successfully", response.data);
      
      // Save workspace ID from response to localStorage if it exists
      if (response.data.data?.defaultWorkspaceId) {
        try {
          // Set the workspace ID in localStorage
          localStorage.setItem("workspaceId", response.data.data.defaultWorkspaceId);
          
          // Verify localStorage was set correctly
          const verifiedValue = localStorage.getItem("workspaceId");
          if (verifiedValue) {
            console.log("✅ Workspace ID saved to localStorage and verified:", verifiedValue);
          } else {
            console.error("❌ Failed to save workspace ID to localStorage - verification failed");
          }
        } catch (storageError) {
          console.error("Error saving workspace ID to localStorage:", storageError);
        }
      } else {
        console.warn("No default workspace ID found in user profile response");
      }
      
      return response.data.data;
    } catch (error: any) {
      console.error("Error fetching user data:", error.message);
      return rejectWithValue(error.response?.data?.message || "Failed to load user profile");
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await HttpClient.apiClient.get(AUTH_ENDPOINTS.USER_PROFILE);
      console.log("User profile fetched:", response.data);
      
      // Save workspace ID from response to localStorage if it exists
      if (response.data.data?.defaultWorkspaceId) {
        try {
          // Set the workspace ID in localStorage
          localStorage.setItem("workspaceId", response.data.data.defaultWorkspaceId);
          
          // Verify localStorage was set correctly
          const verifiedValue = localStorage.getItem("workspaceId");
          if (verifiedValue) {
            console.log("✅ Workspace ID saved to localStorage and verified:", verifiedValue);
          } else {
            console.error("❌ Failed to save workspace ID to localStorage - verification failed");
          }
        } catch (storageError) {
          console.error("Error saving workspace ID to localStorage:", storageError);
        }
      } else {
        console.warn("No default workspace ID found in user profile response");
      }
      
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch user profile");
    }
  }
);

export const fetchWorkspaceData = createAsyncThunk(
  "auth/fetchWorkspaceData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await HttpClient.apiClient.get("/workspace/6c22b22f-7bdf-43db-b7c1-9c5884125c63");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch workspace data");
    }
  }
);
