
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import type { Content, ContentStatus } from '@/types/content';

type SortField = 'title' | 'createdAt' | 'updatedAt' | 'category' | 'messageCount' | 'lastUpdated';

export interface ContentState {
  items: Content[];
  selectedIds: string[];
  loading: boolean;
  error: string | null;
  filters: {
    status: ContentStatus | null;
    category: string | null;
    chatbot: string;
  };
  sort: {
    field: SortField;
    direction: 'asc' | 'desc';
  };
}

const initialState: ContentState = {
  items: [],
  selectedIds: [],
  loading: false,
  error: null,
  filters: {
    status: null,
    category: null,
    chatbot: '',
  },
  sort: {
    field: 'updatedAt',
    direction: 'desc',
  },
};

export const fetchContent = createAsyncThunk(
  'content/fetchContent',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/content');
      if (!response.ok) {
        throw new Error('Failed to fetch content');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateContent = createAsyncThunk(
  'content/updateContent',
  async ({ id, updates }: { id: string; updates: Partial<Content> }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/content/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error('Failed to update content');
      }
      return { id, updates: await response.json() };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteContent = createAsyncThunk(
  'content/deleteContent',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/content/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete content');
      }
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    selectContent: (state, action: PayloadAction<string>) => {
      state.selectedIds.push(action.payload);
    },
    deselectContent: (state, action: PayloadAction<string>) => {
      state.selectedIds = state.selectedIds.filter(id => id !== action.payload);
    },
    clearSelection: (state) => {
      state.selectedIds = [];
    },
    setStatusFilter: (state, action: PayloadAction<ContentStatus | null>) => {
      state.filters.status = action.payload;
    },
    setCategoryFilter: (state, action: PayloadAction<string | null>) => {
      state.filters.category = action.payload;
    },
    setChatbotFilter: (state, action: PayloadAction<string | null>) => {
      state.filters.chatbot = action.payload || '';
    },
    clearFilters: (state) => {
      state.filters = {
        status: null,
        category: null,
        chatbot: '',
      };
    },
    setSortField: (state, action: PayloadAction<SortField>) => {
      state.sort.field = action.payload;
    },
    setSortDirection: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sort.direction = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContent.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContent.fulfilled, (state, action) => {
        state.loading = false;
        const { id, updates } = action.payload;
        const index = state.items.findIndex(item => item.id === id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...updates };
        }
      })
      .addCase(updateContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteContent.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
        state.selectedIds = state.selectedIds.filter(id => id !== action.payload);
      })
      .addCase(deleteContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  selectContent, 
  deselectContent, 
  clearSelection,
  setStatusFilter,
  setCategoryFilter,
  setChatbotFilter,
  clearFilters,
  setSortField,
  setSortDirection,
} = contentSlice.actions;

export const selectAllContent = (state: RootState) => state.content.items;
export const selectSelectedContentIds = (state: RootState) => state.content.selectedIds;
export const selectContentLoading = (state: RootState) => state.content.loading;
export const selectContentError = (state: RootState) => state.content.error;
export const selectContentFilters = (state: RootState) => state.content.filters;
export const selectContentSort = (state: RootState) => state.content.sort;

export const selectContentById = (state: RootState, id: string) =>
  state.content.items.find(item => item.id === id);

export const contentReducer = contentSlice.reducer;
