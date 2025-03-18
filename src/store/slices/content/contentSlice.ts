
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Content, ContentStatus, SortField } from '@/types/content';
import { RootState } from '../../store';

interface ContentState {
  items: Content[];
  selectedIds: string[];
  filters: {
    status: ContentStatus | null;
    category: string | null;
    chatbot: string | null;
  };
  sort: {
    field: SortField;
    direction: 'asc' | 'desc';
  };
  search: {
    query: string;
    suggestions: string[];
    history: string[];
  };
  loading: boolean;
  error: string | null;
}

const initialState: ContentState = {
  items: [],
  selectedIds: [],
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
  loading: false,
  error: null,
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
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateContent = createAsyncThunk(
  'content/updateContent',
  async ({ id, data }: { id: string; data: Partial<Content> }, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      const response = await fetch(`/api/content/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to update content');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteContent = createAsyncThunk(
  'content/deleteContent',
  async (ids: string[], { rejectWithValue }) => {
    try {
      // Replace with actual API call
      const response = await fetch(`/api/content`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });
      if (!response.ok) {
        throw new Error('Failed to delete content');
      }
      return ids;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateContentStatus = createAsyncThunk(
  'content/updateStatus',
  async ({ ids, status }: { ids: string[]; status: ContentStatus }, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      const response = await fetch(`/api/content/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, status }),
      });
      if (!response.ok) {
        throw new Error('Failed to update content status');
      }
      return { ids, status };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const reassignChatbot = createAsyncThunk(
  'content/reassignChatbot',
  async ({ ids, chatbotId, chatbotName }: { ids: string[]; chatbotId: string; chatbotName: string }, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      const response = await fetch(`/api/content/chatbot`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, chatbotId }),
      });
      if (!response.ok) {
        throw new Error('Failed to reassign chatbot');
      }
      return { ids, chatbot: { id: chatbotId, name: chatbotName } };
    } catch (error) {
      return rejectWithValue((error as Error).message);
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
      state.filters.chatbot = action.payload;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setSortField: (state, action: PayloadAction<SortField>) => {
      state.sort.field = action.payload;
    },
    setSortDirection: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sort.direction = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.search.query = action.payload;
      if (action.payload && !state.search.history.includes(action.payload)) {
        state.search.history.unshift(action.payload);
        state.search.history = state.search.history.slice(0, 10);
      }
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
      .addCase(updateContent.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete content
      .addCase(deleteContent.fulfilled, (state, action) => {
        state.items = state.items.filter(item => !action.payload.includes(item.id));
        state.selectedIds = state.selectedIds.filter(id => !action.payload.includes(id));
      })
      // Update content status
      .addCase(updateContentStatus.fulfilled, (state, action) => {
        const { ids, status } = action.payload;
        state.items = state.items.map(item => {
          if (ids.includes(item.id)) {
            return { ...item, status };
          }
          return item;
        });
      })
      // Reassign chatbot
      .addCase(reassignChatbot.fulfilled, (state, action) => {
        const { ids, chatbot } = action.payload;
        state.items = state.items.map(item => {
          if (ids.includes(item.id)) {
            const existingChatbots = item.chatbots || [];
            const updatedChatbots = existingChatbots.filter(bot => bot.id !== chatbot.id);
            updatedChatbots.push(chatbot);
            return { ...item, chatbots: updatedChatbots };
          }
          return item;
        });
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
  setSearchQuery,
  updateSearchSuggestions,
  clearSearch,
  clearSearchHistory,
} = contentSlice.actions;

export const selectContentItems = (state: RootState) => state.content.items;
export const selectSelectedIds = (state: RootState) => state.content.selectedIds;
export const selectContentFilters = (state: RootState) => state.content.filters;
export const selectContentSort = (state: RootState) => state.content.sort;
export const selectContentLoading = (state: RootState) => state.content.loading;
export const selectContentError = (state: RootState) => state.content.error;

export const contentReducer = contentSlice.reducer;
