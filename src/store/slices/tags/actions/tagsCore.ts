
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Tag } from '@/types/tag';

export interface TagsState {
  entities: Record<string, Tag>;
  ids: string[];
  selectedTags: string[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  itemsPerPage: number;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  filterEntity: string | null;
  searchQuery: string;
  total: number;
}

const initialState: TagsState = {
  entities: {},
  ids: [],
  selectedTags: [],
  loading: false,
  error: null,
  currentPage: 1,
  itemsPerPage: 10,
  sortField: 'name',
  sortDirection: 'asc',
  filterEntity: null,
  searchQuery: '',
  total: 0
};

const tagsCoreSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    'tags/setPage': (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    'tags/setItemsPerPage': (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
    },
    'tags/setSort': (state, action: PayloadAction<{ field: string; direction: 'asc' | 'desc' }>) => {
      state.sortField = action.payload.field;
      state.sortDirection = action.payload.direction;
    },
    'tags/setFilter': (state, action: PayloadAction<string | null>) => {
      state.filterEntity = action.payload;
    },
    'tags/setSearch': (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    'tags/selectTag': (state, action: PayloadAction<string>) => {
      if (!state.selectedTags.includes(action.payload)) {
        state.selectedTags.push(action.payload);
      }
    },
    'tags/deselectTag': (state, action: PayloadAction<string>) => {
      state.selectedTags = state.selectedTags.filter(id => id !== action.payload);
    },
    'tags/selectAllTags': (state) => {
      state.selectedTags = [...state.ids];
    },
    'tags/clearSelectedTags': (state) => {
      state.selectedTags = [];
    }
  }
});

// Export the actions with consistent naming
export const {
  'tags/setPage': setPage,
  'tags/setItemsPerPage': setItemsPerPage,
  'tags/setSort': setSort,
  'tags/setFilter': setFilter,
  'tags/setSearch': setSearch,
  'tags/selectTag': selectTag,
  'tags/deselectTag': deselectTag,
  'tags/selectAllTags': selectAllTags,
  'tags/clearSelectedTags': clearSelectedTags
} = tagsCoreSlice.actions;

// Export the core slice for configuration
export const tagsCoreSlice_ForConfiguration = {
  name: tagsCoreSlice.name,
  initialState: tagsCoreSlice.getInitialState(),
  reducers: tagsCoreSlice.caseReducers
};
