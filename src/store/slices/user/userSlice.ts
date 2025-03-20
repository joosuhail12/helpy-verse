
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { HttpClient } from '@/api/services/http';
import { AUTH_ENDPOINTS } from '@/api/services/http/config';

// Define the user state interface
interface UserState {
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    workspace?: {
      id: string;
      name: string;
    };
  } | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

// Fetch user profile thunk
export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await HttpClient.apiClient.get(AUTH_ENDPOINTS.USER_PROFILE);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user profile');
    }
  }
);

// User slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
