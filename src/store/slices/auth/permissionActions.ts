
import { createAsyncThunk } from '@reduxjs/toolkit';
import { HttpClient } from "@/api/services/http";

// Permission related actions
export const getUserPermission = createAsyncThunk(
  "auth/getUserPermission",
  async (_, { rejectWithValue }) => {
    try {
      const response = await HttpClient.apiClient.get("/profile/abilities");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch user permissions");
    }
  }
);
