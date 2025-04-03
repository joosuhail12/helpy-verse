
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ContentState {
  items: any[];
  selectedId: string | null;
  selectedIds: string[];
  loading: boolean;
  error: string | null;
  filters: {
    status: string | null;
    category: string | null;
    chatbot: string | null;
  };
  sort: {
    field: 'title' | 'lastUpdated' | 'messageCount';
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
    setSortField: (state, action: PayloadAction<'title' | 'lastUpdated' | 'messageCount'>) => {
      state.sort.field = action.payload;
    },
    setSortDirection: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sort.direction = action.payload;
    },
    setFilter: (state, action: PayloadAction<{ key: 'status' | 'category' | 'chatbot', value: string | null }>) => {
      const { key, value } = action.payload;
      state.filters[key] = value;
    },
    clearFilters: (state) => {
      state.filters = {
        status: null,
        category: null,
        chatbot: null,
      };
    },
  },
  extraReducers: (builder) => {
    // Extra reducers will be added when we implement API calls
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
  clearFilters,
} = contentSlice.actions;

export default contentSlice.reducer;
