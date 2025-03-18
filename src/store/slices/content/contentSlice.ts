import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { Content, ContentStatus, ContentState, SortField } from '@/types/content';

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
    field: 'updatedAt',
    direction: 'desc',
  },
  search: {
    query: '',
    suggestions: [],
    history: [],
  },
  selectedIds: [],
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

export const fetchContentById = createAsyncThunk(
  'content/fetchContentById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/content/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch content details');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createContent = createAsyncThunk(
  'content/createContent',
  async (content: Partial<Content>, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      if (!response.ok) {
        throw new Error('Failed to create content');
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
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteContent = createAsyncThunk(
  'content/deleteContent',
  async (id: string | string[], { rejectWithValue }) => {
    try {
      const ids = Array.isArray(id) ? id : [id];
      const response = await fetch('/api/content/batch-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });
      if (!response.ok) {
        throw new Error('Failed to delete content');
      }
      return ids;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateContentStatus = createAsyncThunk(
  'content/updateContentStatus',
  async ({ ids, status }: { ids: string[]; status: ContentStatus }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/content/batch-update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, status }),
      });
      if (!response.ok) {
        throw new Error('Failed to update content status');
      }
      return { ids, status };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const reassignChatbot = createAsyncThunk(
  'content/reassignChatbot',
  async ({ ids, chatbotId, chatbotName }: { ids: string[]; chatbotId: string; chatbotName: string }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/content/batch-reassign-chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, chatbotId }),
      });
      if (!response.ok) {
        throw new Error('Failed to reassign chatbot');
      }
      return { ids, chatbot: { id: chatbotId, name: chatbotName } };
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
      state.selectedContentId = action.payload;
      state.selectedContent = state.items.find(content => content.id === action.payload) || null;
    },
    clearSelectedContent: (state) => {
      state.selectedContentId = null;
      state.selectedContent = null;
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
        state.search.history = state.search.history.slice(0, 10);
      }
    },
    clearSearch: (state) => {
      state.search.query = '';
      state.search.suggestions = [];
    },
    clearSearchHistory: (state) => {
      state.search.history = [];
    },
    selectContentItem: (state, action: PayloadAction<string>) => {
      if (!state.selectedIds.includes(action.payload)) {
        state.selectedIds.push(action.payload);
      }
    },
    deselectContentItem: (state, action: PayloadAction<string>) => {
      state.selectedIds = state.selectedIds.filter(id => id !== action.payload);
    },
    toggleContentSelection: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.selectedIds.includes(id)) {
        state.selectedIds = state.selectedIds.filter(itemId => itemId !== id);
      } else {
        state.selectedIds.push(id);
      }
    },
    selectAllContent: (state) => {
      state.selectedIds = state.items.map(item => item.id);
    },
    clearSelection: (state) => {
      state.selectedIds = [];
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
      .addCase(fetchContentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContentById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedContent = action.payload;
        state.selectedContentId = action.payload.id;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(fetchContentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createContent.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateContent.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedContentId === action.payload.id) {
          state.selectedContent = action.payload;
        }
      })
      .addCase(deleteContent.fulfilled, (state, action) => {
        const idsToDelete = Array.isArray(action.payload) ? action.payload : [action.payload];
        state.items = state.items.filter(item => !idsToDelete.includes(item.id));
        state.selectedIds = state.selectedIds.filter(id => !idsToDelete.includes(id));
        if (state.selectedContentId && idsToDelete.includes(state.selectedContentId)) {
          state.selectedContentId = null;
          state.selectedContent = null;
        }
      })
      .addCase(updateContentStatus.fulfilled, (state, action) => {
        const { ids, status } = action.payload;
        state.items = state.items.map(item => {
          if (ids.includes(item.id)) {
            return { ...item, status };
          }
          return item;
        });
        if (state.selectedContent && ids.includes(state.selectedContent.id)) {
          state.selectedContent = { ...state.selectedContent, status };
        }
      })
      .addCase(reassignChatbot.fulfilled, (state, action) => {
        const { ids, chatbot } = action.payload;
        state.items = state.items.map(item => {
          if (ids.includes(item.id)) {
            return { 
              ...item, 
              chatbots: item.chatbots.filter(c => c.id !== chatbot.id).concat(chatbot)
            };
          }
          return item;
        });
        if (state.selectedContent && ids.includes(state.selectedContent.id)) {
          state.selectedContent = { 
            ...state.selectedContent, 
            chatbots: state.selectedContent.chatbots.filter(c => c.id !== chatbot.id).concat(chatbot)
          };
        }
      });
  },
});

export const {
  selectContent,
  clearSelectedContent,
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
  selectContentItem,
  deselectContentItem,
  toggleContentSelection,
  selectAllContent,
  clearSelection,
} = contentSlice.actions;

export const selectContentItems = (state: RootState) => state.content.items;
export const selectContentLoading = (state: RootState) => state.content.loading;
export const selectContentError = (state: RootState) => state.content.error;
export const selectSelectedContent = (state: RootState) => state.content.selectedContent;
export const selectContentFilters = (state: RootState) => state.content.filters;
export const selectContentSort = (state: RootState) => state.content.sort;
export const selectContentSearch = (state: RootState) => state.content.search;
export const selectContentSelectedIds = (state: RootState) => state.content.selectedIds;

export const contentReducer = contentSlice.reducer;
