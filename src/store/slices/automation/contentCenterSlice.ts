
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

type ContentStats = {
  totalFiles: number;
  totalSnippets: number;
  totalWebsites: number;
  activeContent: number;
  averageProcessingTime: number;
  topCategories: { name: string; count: number }[];
};

export type ContentCenterState = {
  stats: ContentStats | null;
  loading: boolean;
  error: string | null;
};

const initialState: ContentCenterState = {
  stats: null,
  loading: false,
  error: null,
};

export const fetchContentStats = createAsyncThunk(
  'contentCenter/fetchContentStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/content/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch content stats');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const contentCenterSlice = createSlice({
  name: 'contentCenter',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContentStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContentStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchContentStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectContentStats = (state: RootState) => state.contentCenter.stats;
export const selectContentCenterLoading = (state: RootState) => state.contentCenter.loading;
export const selectContentCenterError = (state: RootState) => state.contentCenter.error;

export default contentCenterSlice.reducer;
