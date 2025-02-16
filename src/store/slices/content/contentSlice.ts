
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Content, ContentStatus } from '@/types/content';
import { mockContent } from '@/mock/content';

export type SortField = 'lastUpdated' | 'messageCount' | 'title';
export type SortDirection = 'asc' | 'desc';

interface ContentState {
  items: Content[];
  filters: {
    status: ContentStatus | null;
    category: string | null;
    chatbotId: string | null;
  };
  sort: {
    field: SortField;
    direction: SortDirection;
  };
}

const initialState: ContentState = {
  items: mockContent,
  filters: {
    status: null,
    category: null,
    chatbotId: null,
  },
  sort: {
    field: 'lastUpdated',
    direction: 'desc',
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
  },
});

export const {
  setStatusFilter,
  setCategoryFilter,
  setChatbotFilter,
  setSortField,
  setSortDirection,
  clearFilters,
} = contentSlice.actions;

export default contentSlice.reducer;
