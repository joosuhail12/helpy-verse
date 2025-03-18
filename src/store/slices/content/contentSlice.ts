
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Content, ContentState, SortField } from '@/types/content';

// Initial state
const initialState: ContentState = {
  items: [],
  loading: false,
  error: null,
  selectedContentId: null,
  selectedContent: null,
  statusFilter: null,
  categoryFilter: null,
  chatbotFilter: null,
  sortBy: {
    field: 'lastUpdated',
    direction: 'desc'
  },
  filters: {},
  selectedIds: [],
  searchQuery: '',
  lastFetchTime: null,
  search: {
    query: '',
    suggestions: [],
    history: []
  }
};

// Async thunks
export const fetchContents = createAsyncThunk(
  'content/fetchContents',
  async (_, { rejectWithValue }) => {
    try {
      // Mock API call
      const response = await new Promise<Content[]>(resolve => {
        setTimeout(() => resolve([]), 500);
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch contents');
    }
  }
);

export const updateContent = createAsyncThunk(
  'content/updateContent',
  async ({ id, updates }: { id: string, updates: Partial<Content> }, { rejectWithValue }) => {
    try {
      // Mock API call
      const response = await new Promise<Content>(resolve => {
        setTimeout(() => resolve({ id, ...updates } as Content), 500);
      });
      return { id, updates: response };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update content');
    }
  }
);

export const updateContentStatus = createAsyncThunk(
  'content/updateContentStatus',
  async ({ ids, status }: { ids: string[], status: string }, { dispatch }) => {
    // Implementation for bulk status update
    for (const id of ids) {
      await dispatch(updateContent({ id, updates: { status } }));
    }
    return { ids, status };
  }
);

export const deleteContents = createAsyncThunk(
  'content/deleteContents',
  async (ids: string[], { rejectWithValue }) => {
    try {
      // Mock API call
      await new Promise<void>(resolve => setTimeout(resolve, 500));
      return ids;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete contents');
    }
  }
);

export const reassignChatbot = createAsyncThunk(
  'content/reassignChatbot',
  async ({ contentIds, chatbotId, chatbotName }: { contentIds: string[], chatbotId: string, chatbotName: string }, { dispatch }) => {
    // Implementation for reassigning chatbot
    for (const id of contentIds) {
      await dispatch(updateContent({ 
        id, 
        updates: { 
          chatbots: [{ id: chatbotId, name: chatbotName }] 
        } 
      }));
    }
    return { contentIds, chatbotId, chatbotName };
  }
);

// Slice
const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    selectContent: (state, action: PayloadAction<string>) => {
      state.selectedContentId = action.payload;
      state.selectedContent = state.items.find(item => item.id === action.payload) || null;
    },
    deselectContent: (state) => {
      if (state.selectedContentId) {
        state.selectedContentId = null;
        state.selectedContent = null;
      }
    },
    setStatusFilter: (state, action: PayloadAction<string | null>) => {
      state.statusFilter = action.payload;
    },
    setCategoryFilter: (state, action: PayloadAction<string | null>) => {
      state.categoryFilter = action.payload;
    },
    setChatbotFilter: (state, action: PayloadAction<string | null>) => {
      state.chatbotFilter = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSortField: (state, action: PayloadAction<SortField>) => {
      state.sortBy.field = action.payload;
    },
    setSortDirection: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortBy.direction = action.payload;
    },
    clearFilters: (state) => {
      state.statusFilter = null;
      state.categoryFilter = null;
      state.chatbotFilter = null;
      state.searchQuery = '';
    },
    toggleContentSelection: (state, action: PayloadAction<string>) => {
      const contentId = action.payload;
      const index = state.selectedIds.indexOf(contentId);
      
      if (index === -1) {
        state.selectedIds.push(contentId);
      } else {
        state.selectedIds.splice(index, 1);
      }
    },
    selectAllContents: (state) => {
      state.selectedIds = state.items.map(item => item.id);
    },
    clearSelection: (state) => {
      state.selectedIds = [];
    },
    updateSearchSuggestions: (state, action: PayloadAction<string[]>) => {
      if (state.search) {
        state.search.suggestions = action.payload;
      }
    },
    clearSearch: (state) => {
      if (state.search) {
        state.search.query = '';
        state.search.suggestions = [];
      }
      state.searchQuery = '';
    },
    clearSearchHistory: (state) => {
      if (state.search) {
        state.search.history = [];
      }
    }
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
        state.lastFetchTime = Date.now();
      })
      .addCase(fetchContents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateContent.fulfilled, (state, action) => {
        const { id, updates } = action.payload;
        const contentIndex = state.items.findIndex(item => item.id === id);
        
        if (contentIndex !== -1) {
          state.items[contentIndex] = { ...state.items[contentIndex], ...updates };
          
          // Update selected content if it's the one being updated
          if (state.selectedContentId === id && state.selectedContent) {
            state.selectedContent = { ...state.selectedContent, ...updates };
          }
        }
      })
      .addCase(deleteContents.fulfilled, (state, action) => {
        const deletedIds = action.payload;
        state.items = state.items.filter(item => !deletedIds.includes(item.id));
        
        // Clear selection if selected content was deleted
        if (state.selectedContentId && deletedIds.includes(state.selectedContentId)) {
          state.selectedContentId = null;
          state.selectedContent = null;
        }
        
        // Update selected content IDs
        state.selectedIds = state.selectedIds.filter(id => !deletedIds.includes(id));
      });
  }
});

export const { 
  selectContent, 
  deselectContent,
  setStatusFilter,
  setCategoryFilter,
  setChatbotFilter,
  setSearchQuery,
  setSortField,
  setSortDirection,
  clearFilters,
  toggleContentSelection,
  selectAllContents,
  clearSelection,
  updateSearchSuggestions,
  clearSearch,
  clearSearchHistory
} = contentSlice.actions;

export default contentSlice.reducer;
