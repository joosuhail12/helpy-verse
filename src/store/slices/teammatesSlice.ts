
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Teammate } from '@/types/teammate';

const mockTeammates: Teammate[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    status: 'active',
    lastActive: new Date().toISOString(),
    createdAt: '2024-01-01T00:00:00.000Z',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
  }
];

interface TeammatesState {
  teammates: Teammate[];
  loading: boolean;
  error: string | null;
}

const initialState: TeammatesState = {
  teammates: [],
  loading: false,
  error: null
};

export const fetchTeammates = createAsyncThunk(
  'teammates/fetchTeammates',
  async () => {
    // In a real implementation, this would be an API call
    // For now, return mock data
    return mockTeammates;
  }
);

const teammatesSlice = createSlice({
  name: 'teammates',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeammates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeammates.fulfilled, (state, action) => {
        state.loading = false;
        state.teammates = action.payload;
      })
      .addCase(fetchTeammates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch teammates';
      });
  },
});

export default teammatesSlice.reducer;
