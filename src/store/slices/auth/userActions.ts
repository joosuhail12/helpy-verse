
import { createAsyncThunk } from '@reduxjs/toolkit';
import { HttpClient } from "@/api/services/http";
import { WorkspaceService } from '@/services/workspaceService';
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
        const workspaceId = response.data.data.defaultWorkspaceId;
        
        // Use our centralized workspace service
        WorkspaceService.setWorkspaceId(workspaceId);
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
      
      // Save workspace ID using our centralized service
      if (response.data.data?.defaultWorkspaceId) {
        WorkspaceService.setWorkspaceId(response.data.data.defaultWorkspaceId);
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
      // Get workspace ID from our service
      const workspaceId = WorkspaceService.getWorkspaceId();
      if (!workspaceId) {
        return rejectWithValue("No workspace ID available. Please log in again.");
      }
      
      const response = await HttpClient.apiClient.get(`/workspace/${workspaceId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch workspace data");
    }
  }
);
