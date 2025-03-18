
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Content, ContentState, ContentStatus, SortField } from '@/types/content';

const initialState: ContentState = {
  items: [],
  selectedIds: [],
  selectedContent: null,
  selectedContentId: null,
  loading: false,
  error: null,
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
};

export const fetchContents = createAsyncThunk('content/fetchContents', async () => {
  // Fetch content logic would go here
  return [];
});

export const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setContentItems: (state, action: PayloadAction<Content[]>) => {
      state.items = action.payload;
    },
    selectContent: (state, action: PayloadAction<string>) => {
      state.selectedContentId = action.payload;
      state.selectedContent = state.items.find(item => item.id === action.payload) || null;
    },
    deselectContent: (state, action: PayloadAction<string>) => {
      if (state.selectedContentId === action.payload) {
        state.selectedContentId = null;
        state.selectedContent = null;
      }
    },
    toggleContentSelection: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.selectedIds.includes(id)) {
        state.selectedIds = state.selectedIds.filter(selectedId => selectedId !== id);
      } else {
        state.selectedIds.push(id);
      }
    },
    selectAllContent: (state) => {
      state.selectedIds = state.items.map(item => item.id);
    },
    deselectAllContent: (state) => {
      state.selectedIds = [];
    },
    clearSelection: (state) => {
      state.selectedIds = [];
    },
    setContentFilter: (state, action: PayloadAction<{ key: 'status' | 'category' | 'chatbot'; value: string | null }>) => {
      const { key, value } = action.payload;
      state.filters[key] = value as any;
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
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.search.query = action.payload;
    },
    updateSearchSuggestions: (state, action: PayloadAction<string[]>) => {
      state.search.suggestions = action.payload;
    },
    addToSearchHistory: (state, action: PayloadAction<string>) => {
      if (!state.search.history.includes(action.payload)) {
        state.search.history.unshift(action.payload);
        // Limit history to 10 entries
        if (state.search.history.length > 10) {
          state.search.history = state.search.history.slice(0, 10);
        }
      }
    },
    clearSearch: (state) => {
      state.search.query = '';
      state.search.suggestions = [];
    },
    clearSearchHistory: (state) => {
      state.search.history = [];
    },
    updateContent: (state, action: PayloadAction<{ id: string; updates: Partial<Content> }>) => {
      const { id, updates } = action.payload;
      const contentIndex = state.items.findIndex(item => item.id === id);
      if (contentIndex !== -1) {
        state.items[contentIndex] = { ...state.items[contentIndex], ...updates };
        if (state.selectedContentId === id) {
          state.selectedContent = state.items[contentIndex];
        }
      }
    },
    deleteContent: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.items = state.items.filter(item => item.id !== id);
      state.selectedIds = state.selectedIds.filter(selectedId => selectedId !== id);
      if (state.selectedContentId === id) {
        state.selectedContentId = null;
        state.selectedContent = null;
      }
    },
    deleteContents: (state, action: PayloadAction<string[]>) => {
      const ids = action.payload;
      state.items = state.items.filter(item => !ids.includes(item.id));
      state.selectedIds = state.selectedIds.filter(id => !ids.includes(id));
      if (state.selectedContentId && ids.includes(state.selectedContentId)) {
        state.selectedContentId = null;
        state.selectedContent = null;
      }
    },
    updateContentStatus: (state, action: PayloadAction<{ ids: string[]; status: ContentStatus }>) => {
      const { ids, status } = action.payload;
      state.items = state.items.map(item => 
        ids.includes(item.id) ? { ...item, status } : item
      );
    },
    reassignChatbot: (state, action: PayloadAction<{ contentIds: string[]; chatbotId: string; chatbotName: string }>) => {
      const { contentIds, chatbotId, chatbotName } = action.payload;
      state.items = state.items.map(item => {
        if (contentIds.includes(item.id)) {
          const chatbots = [...(item.chatbots || [])];
          if (!chatbots.some(bot => bot.id === chatbotId)) {
            chatbots.push({ id: chatbotId, name: chatbotName });
          }
          return { ...item, chatbots };
        }
        return item;
      });
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
        state.error = action.error.message || 'Failed to fetch content';
      });
  },
});

export const {
  setContentItems,
  selectContent,
  deselectContent,
  toggleContentSelection,
  selectAllContent,
  deselectAllContent,
  clearSelection,
  setContentFilter,
  setStatusFilter,
  setCategoryFilter,
  setChatbotFilter,
  clearFilters,
  setSortField,
  setSortDirection,
  setSearchQuery,
  updateSearchSuggestions,
  addToSearchHistory,
  clearSearch,
  clearSearchHistory,
  updateContent,
  deleteContent,
  deleteContents,
  updateContentStatus,
  reassignChatbot,
} = contentSlice.actions;

export const contentReducer = contentSlice.reducer;
