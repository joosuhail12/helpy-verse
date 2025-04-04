
import { createAsyncThunk } from '@reduxjs/toolkit';
import { HttpClient } from "@/api/services/http";
import { setPermissions, setAuthLoading, setAuthError } from './authSlice';
import { AppDispatch } from '@/store/store';

// Permission related actions
export const getUserPermission = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setAuthLoading(true));
    
    const response = await HttpClient.apiClient.get("/profile/abilities");
    
    dispatch(setPermissions(response.data));
    dispatch(setAuthLoading(false));
    return { data: response.data };
  } catch (error: any) {
    dispatch(setAuthError(error.response?.data?.message || "Failed to fetch user permissions"));
    return { error: error.response?.data?.message || "Failed to fetch user permissions" };
  }
};

// Legacy thunk version for backward compatibility
export const getUserPermissionThunk = createAsyncThunk(
  "auth/getUserPermission",
  async (_, { rejectWithValue, dispatch }) => {
    const result = await getUserPermission()(dispatch);
    if (result.error) return rejectWithValue(result.error);
    return result.data;
  }
);
