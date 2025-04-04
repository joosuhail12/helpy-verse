
import { createAsyncThunk } from '@reduxjs/toolkit';
import { HttpClient } from "@/api/services/http";
import { AUTH_ENDPOINTS } from "@/api/services/http/config";
import { setUserData, setAuthLoading, setAuthError } from './authSlice';
import type { AppDispatch } from '@/store/store';

// Direct action creators
export const fetchUserData = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setAuthLoading(true));
    
    console.log("Fetching user profile data");
    const response = await HttpClient.apiClient.get(AUTH_ENDPOINTS.USER_PROFILE);
    console.log("User profile data fetched successfully", response.data);
    
    // Save workspace ID from response to localStorage if it exists
    if (response.data.data?.defaultWorkspaceId) {
      try {
        const workspaceId = response.data.data.defaultWorkspaceId;
        
        // Set the workspace ID in localStorage
        localStorage.setItem("workspaceId", workspaceId);
        console.log(`✅ Workspace ID saved to localStorage: ${workspaceId}`);
        
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
    
    dispatch(setUserData(response.data.data));
    dispatch(setAuthLoading(false));
    return { data: response.data.data };
  } catch (error: any) {
    console.error("Error fetching user data:", error.message);
    dispatch(setAuthError(error.response?.data?.message || "Failed to load user profile"));
    return { error: error.response?.data?.message || "Failed to load user profile" };
  }
};

export const fetchUserProfile = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setAuthLoading(true));
    
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
    
    dispatch(setUserData(response.data.data));
    dispatch(setAuthLoading(false));
    return { data: response.data.data };
  } catch (error: any) {
    dispatch(setAuthError(error.response?.data?.message || "Failed to fetch user profile"));
    return { error: error.response?.data?.message || "Failed to fetch user profile" };
  }
};

export const fetchWorkspaceData = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setAuthLoading(true));
    
    const response = await HttpClient.apiClient.get("/workspace/6c22b22f-7bdf-43db-b7c1-9c5884125c63");
    
    dispatch(setUserData(response.data));
    dispatch(setAuthLoading(false));
    return { data: response.data };
  } catch (error: any) {
    dispatch(setAuthError(error.response?.data?.message || "Failed to fetch workspace data"));
    return { error: error.response?.data?.message || "Failed to fetch workspace data" };
  }
};

// Legacy thunk versions for backward compatibility
export const fetchUserDataThunk = createAsyncThunk(
  "user/fetchData",
  async (_, { rejectWithValue, dispatch }) => {
    const result = await fetchUserData()(dispatch as AppDispatch);
    if (result.error) return rejectWithValue(result.error);
    return result.data;
  }
);

export const fetchUserProfileThunk = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue, dispatch }) => {
    const result = await fetchUserProfile()(dispatch as AppDispatch);
    if (result.error) return rejectWithValue(result.error);
    return result.data;
  }
);

export const fetchWorkspaceDataThunk = createAsyncThunk(
  "auth/fetchWorkspaceData",
  async (_, { rejectWithValue, dispatch }) => {
    const result = await fetchWorkspaceData()(dispatch as AppDispatch);
    if (result.error) return rejectWithValue(result.error);
    return result.data;
  }
);
