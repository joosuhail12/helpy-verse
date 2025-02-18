import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Content, ContentStatus } from '@/types/content';
import { mockContent } from '@/mock/content';

export type SortField = 'lastUpdated' | 'messageCount' | 'title';
export type SortDirection = 'asc' | 'desc';

interface ContentState {
  items: Content[];
  selectedIds: string[];
  filters: {
    status: ContentStatus | null;
    category: string | null;
    chatbotId: string | null;
  };
  sort: {
    field: SortField;
    direction: SortDirection;
  };
  search: {
    query: string;
    suggestions: string[];
    history: string[];
  };
}

const initialState: ContentState = {
  items: mockContent,
  selectedIds: [],
  filters: {
    status: null,
    category: null,
    chatbotId: null,
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

export const contentSlice = createSlice({
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
      state.filters.chatbotId = action.payload;
    },
    setSortField: (state, action: PayloadAction<SortField>) => {
      state.sort.field = action.payload;
    },
    setSortDirection: (state, action: PayloadAction<SortDirection>) => {
      state.sort.direction = action.payload;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    selectContent: (state, action: PayloadAction<string>) => {
      state.selectedIds.push(action.payload);
    },
    deselectContent: (state, action: PayloadAction<string>) => {
      state.selectedIds = state.selectedIds.filter(id => id !== action.payload);
    },
    selectAllContent: (state) => {
      state.selectedIds = state.items.map(item => item.id);
    },
    clearSelection: (state) => {
      state.selectedIds = [];
    },
    updateContentStatus: (state, action: PayloadAction<{ ids: string[], status: ContentStatus }>) => {
      const { ids, status } = action.payload;
      state.items = state.items.map(item => 
        ids.includes(item.id) ? { ...item, status } : item
      );
    },
    reassignChatbot: (state, action: PayloadAction<{ ids: string[], chatbotId: string, chatbotName: string }>) => {
      const { ids, chatbotId, chatbotName } = action.payload;
      state.items = state.items.map(item => 
        ids.includes(item.id) ? { ...item, chatbot: { id: chatbotId, name: chatbotName } } : item
      );
    },
    deleteContent: (state, action: PayloadAction<string[]>) => {
      state.items = state.items.filter(item => !action.payload.includes(item.id));
      state.selectedIds = state.selectedIds.filter(id => !action.payload.includes(id));
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.search.query = action.payload;
      if (action.payload.trim() && !state.search.history.includes(action.payload)) {
        state.search.history = [action.payload, ...state.search.history.slice(0, 4)];
      }
    },
    updateSearchSuggestions: (state) => {
      const query = state.search.query.toLowerCase();
      if (!query) {
        state.search.suggestions = [];
        return;
      }
      
      const suggestions = state.items
        .filter(item => 
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
        )
        .map(item => item.title)
        .slice(0, 5);
      
      state.search.suggestions = Array.from(new Set(suggestions));
    },
    clearSearchHistory: (state) => {
      state.search.history = [];
    },
    clearSearch: (state) => {
      state.search.query = '';
      state.search.suggestions = [];
    },
  },
});

export const {
  setStatusFilter,
  setCategoryFilter,
  setChatbotFilter,
  setSortField,
  setSortDirection,
  clearFilters,
  selectContent,
  deselectContent,
  selectAllContent,
  clearSelection,
  updateContentStatus,
  reassignChatbot,
  deleteContent,
  setSearchQuery,
  updateSearchSuggestions,
  clearSearchHistory,
  clearSearch,
} = contentSlice.actions;

export default contentSlice.reducer;
