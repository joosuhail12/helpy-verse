
import { createAsyncThunk } from '@reduxjs/toolkit';
import { HttpClient } from "@/api/services/http";
import { AUTH_ENDPOINTS } from "@/api/services/http/config";

export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
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
