
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Content, ContentStatus, SortField } from '@/types/content';

export interface ContentState {
  items: Content[];
  selectedId: string | null;
  selectedIds: string[];
  loading: boolean;
  error: string | null;
  filters: {
    status: ContentStatus | null;
    category: string | null;
    chatbot: string | null;
  };
  sort: {
    field: SortField;
    direction: 'asc' | 'desc';
  };
}

const initialState: ContentState = {
  items: [],
  selectedId: null,
  selectedIds: [],
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
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    selectContent: (state, action: PayloadAction<string>) => {
      state.selectedId = action.payload;
    },
    toggleContentSelection: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.selectedIds.indexOf(id);
      if (index !== -1) {
        state.selectedIds.splice(index, 1);
      } else {
        state.selectedIds.push(id);
      }
    },
    setSelectedContents: (state, action: PayloadAction<string[]>) => {
      state.selectedIds = action.payload;
    },
    clearSelection: (state) => {
      state.selectedIds = [];
    },
    setSortField: (state, action: PayloadAction<SortField>) => {
      state.sort.field = action.payload;
    },
    setSortDirection: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sort.direction = action.payload;
    },
    setFilter: (state, action: PayloadAction<{ key: 'status' | 'category' | 'chatbot', value: string | null }>) => {
      const { key, value } = action.payload;
      state.filters[key] = value;
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
    updateContentStatus: (state, action: PayloadAction<{ ids: string[], status: ContentStatus }>) => {
      const { ids, status } = action.payload;
      state.items = state.items.map(item => 
        ids.includes(item.id) ? { ...item, status } : item
      );
    },
    reassignChatbot: (state, action: PayloadAction<{ contentIds: string[], chatbotId: string, chatbotName: string }>) => {
      const { contentIds, chatbotId, chatbotName } = action.payload;
      state.items = state.items.map(item => {
        if (contentIds.includes(item.id)) {
          const newChatbots = [...(item.chatbots || [])];
          if (!newChatbots.some(bot => bot.id === chatbotId)) {
            newChatbots.push({ id: chatbotId, name: chatbotName });
          }
          return { ...item, chatbots: newChatbots };
        }
        return item;
      });
    },
    deleteContents: (state, action: PayloadAction<string[]>) => {
      const ids = action.payload;
      state.items = state.items.filter(item => !ids.includes(item.id));
    }
  },
  extraReducers: (builder) => {
    // Extra reducers will be added when implementing API calls
  },
});

export const {
  selectContent,
  toggleContentSelection,
  setSelectedContents,
  clearSelection,
  setSortField,
  setSortDirection,
  setFilter,
  setStatusFilter,
  setCategoryFilter,
  setChatbotFilter,
  clearFilters,
  updateContentStatus,
  reassignChatbot,
  deleteContents
} = contentSlice.actions;

export default contentSlice.reducer;
