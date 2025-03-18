import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import type { Content, ContentState, ContentStatus, SortField } from '@/types/content';

const initialState: ContentState = {
  items: [],
  loading: false,
  error: null,
  selectedContent: null,
  selectedContentId: null,
  filters: {
    status: null,
    category: null,
    chatbot: null,
  },
  sort: {
    field: 'lastUpdated',
    direction: 'desc',
  },
  search: {
    query: '',
    suggestions: [],
    history: [],
  },
  selectedIds: [],
};

// Async Thunks
export const fetchContents = createAsyncThunk(
  'content/fetchContents',
  async (_, { rejectWithValue }) => {
    try {
      // API call placeholder
      const response = await fetch('/api/contents');
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchContentById = createAsyncThunk(
  'content/fetchContentById',
  async (id: string, { rejectWithValue }) => {
    try {
      // API call placeholder
      const response = await fetch(`/api/contents/${id}`);
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateContent = createAsyncThunk(
  'content/updateContent',
  async ({ id, updates }: { id: string; updates: Partial<Content> }, { rejectWithValue }) => {
    try {
      // API call placeholder
      const response = await fetch(`/api/contents/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateContentStatus = createAsyncThunk(
  'content/updateContentStatus',
  async ({ id, status }: { id: string; status: ContentStatus }, { rejectWithValue }) => {
    try {
      // API call placeholder
      const response = await fetch(`/api/contents/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      return { id, status, content: data };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const reassignChatbot = createAsyncThunk(
  'content/reassignChatbot',
  async ({ ids, chatbotId, add }: { ids: string[]; chatbotId: string; add: boolean }, { rejectWithValue }) => {
    try {
      // API call placeholder
      const response = await fetch(`/api/contents/chatbots`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids, chatbotId, action: add ? 'add' : 'remove' }),
      });
      const data = await response.json();
      return { ids, chatbotId, add, results: data };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setStatusFilter: (state, action: PayloadAction<ContentStatus | null>) => {
      state.filters.status = action.payload;
    },
    setCategoryFilter: (state, action: PayloadAction<string | null>) => {
      state.filters.category = action.payload;
    },
    setChatbotFilter: (state, action: PayloadAction<string | null>) => {
      state.filters.chatbot = action.payload;
    },
    clearFilters: (state) => {
      state.filters = { status: null, category: null, chatbot: null };
    },
    setSortField: (state, action: PayloadAction<SortField>) => {
      state.sort.field = action.payload;
    },
    setSortDirection: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sort.direction = action.payload;
    },
    selectContent: (state, action: PayloadAction<string>) => {
      if (!state.selectedIds.includes(action.payload)) {
        state.selectedIds.push(action.payload);
      }
    },
    deselectContent: (state, action: PayloadAction<string>) => {
      state.selectedIds = state.selectedIds.filter(id => id !== action.payload);
    },
    clearSelection: (state) => {
      state.selectedIds = [];
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContents.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchContents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchContentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContentById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedContent = action.payload;
        state.selectedContentId = action.payload.id;
      })
      .addCase(fetchContentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateContent.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload };
        }
        if (state.selectedContent && state.selectedContent.id === action.payload.id) {
          state.selectedContent = { ...state.selectedContent, ...action.payload };
        }
      })
      .addCase(updateContentStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index].status = action.payload.status;
        }
        if (state.selectedContent && state.selectedContent.id === action.payload.id) {
          state.selectedContent.status = action.payload.status;
        }
      });
  },
});

export const { 
  setStatusFilter, 
  setCategoryFilter, 
  setChatbotFilter, 
  clearFilters,
  setSortField,
  setSortDirection,
  selectContent,
  deselectContent,
  clearSelection,
  setSearchQuery,
  updateSearchSuggestions,
  clearSearch,
  clearSearchHistory
} = contentSlice.actions;

// Selectors
export const selectContentItems = (state: RootState) => state.content.items;
export const selectContentLoading = (state: RootState) => state.content.loading;
export const selectContentError = (state: RootState) => state.content.error;
export const selectSelectedContent = (state: RootState) => state.content.selectedContent;
export const selectContentFilters = (state: RootState) => state.content.filters;
export const selectContentSort = (state: RootState) => state.content.sort;
export const selectContentSearch = (state: RootState) => state.content.search;
export const selectSelectedContentIds = (state: RootState) => state.content.selectedIds;

export const contentReducer = contentSlice.reducer;
