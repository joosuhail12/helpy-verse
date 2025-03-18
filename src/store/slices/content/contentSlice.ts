
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

export type Content = {
  id: string;
  title: string;
  content: string;
  type: 'snippet' | 'file' | 'website';
  status: 'active' | 'inactive' | 'draft';
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  chatbots: string[];
};

export type ContentState = {
  items: Content[];
  selectedIds: string[];
  loading: boolean;
  error: string | null;
  filters: {
    status: string | null;
    category: string | null;
    chatbot: string | null;
  };
  search: {
    query: string;
    suggestions: string[];
    history: string[];
  };
  sort: {
    field: SortField;
    direction: 'asc' | 'desc';
  };
};

export type SortField = 'title' | 'createdAt' | 'updatedAt' | 'category';

const initialState: ContentState = {
  items: [],
  selectedIds: [],
  loading: false,
  error: null,
  filters: {
    status: null,
    category: null,
    chatbot: null,
  },
  search: {
    query: '',
    suggestions: [],
    history: [],
  },
  sort: {
    field: 'updatedAt',
    direction: 'desc',
  },
};

// Async thunks
export const fetchContent = createAsyncThunk(
  'content/fetchContent',
  async (_, { rejectWithValue }) => {
    try {
      // Replace with actual API call
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
      // Replace with actual API call
      const response = await fetch(`/api/content/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error('Failed to update content');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    selectContent: (state, action: PayloadAction<string>) => {
      if (!state.selectedIds.includes(action.payload)) {
        state.selectedIds.push(action.payload);
      }
    },
    deselectContent: (state, action: PayloadAction<string>) => {
      state.selectedIds = state.selectedIds.filter(id => id !== action.payload);
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.search.query = action.payload;
    },
    updateSearchSuggestions: (state, action: PayloadAction<string[]>) => {
      state.search.suggestions = action.payload;
    },
    clearSearch: (state) => {
      state.search.query = '';
      state.search.suggestions = [];
    },
    clearSearchHistory: (state) => {
      state.search.history = [];
    },
    setStatusFilter: (state, action: PayloadAction<string | null>) => {
      state.filters.status = action.payload;
    },
    setCategoryFilter: (state, action: PayloadAction<string | null>) => {
      state.filters.category = action.payload;
    },
    setChatbotFilter: (state, action: PayloadAction<string | null>) => {
      state.filters.chatbot = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        status: null,
        category: null,
        chatbot: null,
      };
    },
    setSortField: (state, action: PayloadAction<SortField>) => {
      state.sort.field = action.payload;
    },
    setSortDirection: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sort.direction = action.payload;
    },
    updateContentStatus: (state, action: PayloadAction<{ ids: string[]; status: string }>) => {
      const { ids, status } = action.payload;
      state.items = state.items.map(item => 
        ids.includes(item.id) ? { ...item, status: status as any } : item
      );
    },
    reassignChatbot: (state, action: PayloadAction<{ ids: string[]; chatbotId: string; add: boolean }>) => {
      const { ids, chatbotId, add } = action.payload;
      state.items = state.items.map(item => {
        if (ids.includes(item.id)) {
          if (add && !item.chatbots.includes(chatbotId)) {
            return { ...item, chatbots: [...item.chatbots, chatbotId] };
          } else if (!add) {
            return { ...item, chatbots: item.chatbots.filter(id => id !== chatbotId) };
          }
        }
        return item;
      });
    },
    deleteContent: (state, action: PayloadAction<string[]>) => {
      state.items = state.items.filter(item => !action.payload.includes(item.id));
      state.selectedIds = state.selectedIds.filter(id => !action.payload.includes(id));
    },
    clearSelection: (state) => {
      state.selectedIds = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch content
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
      // Update content
      .addCase(updateContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  selectContent,
  deselectContent,
  setSearchQuery,
  updateSearchSuggestions,
  clearSearch,
  clearSearchHistory,
  setStatusFilter,
  setCategoryFilter,
  setChatbotFilter,
  clearFilters,
  setSortField,
  setSortDirection,
  updateContentStatus,
  reassignChatbot,
  deleteContent,
  clearSelection
} = contentSlice.actions;

// Selectors
export const selectAllContent = (state: RootState) => state.content.items;
export const selectContentLoading = (state: RootState) => state.content.loading;
export const selectContentError = (state: RootState) => state.content.error;
export const selectSelectedContent = (state: RootState) => state.content.selectedIds;
export const selectContentFilters = (state: RootState) => state.content.filters;
export const selectContentSort = (state: RootState) => state.content.sort;
export const selectContentSearch = (state: RootState) => state.content.search;

export const contentReducer = contentSlice.reducer;
