
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Tag, SortField, FilterEntity } from '@/types/tag';

export interface TagsState {
  entities: Record<string, Tag>;
  ids: string[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  itemsPerPage: number;
  sortField: SortField;
  sortDirection: 'asc' | 'desc';
  filterEntity: FilterEntity;
  searchQuery: string;
  selectedTags: string[];
  total: number;
}

const initialState: TagsState = {
  entities: {},
  ids: [],
  loading: false,
  error: null,
  currentPage: 1,
  itemsPerPage: 10,
  sortField: 'name',
  sortDirection: 'asc',
  filterEntity: 'all',
  searchQuery: '',
  selectedTags: [],
  total: 0
};

// Create a slice for core tag actions
const tagsCoreSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    'tags/setPage': (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    'tags/setSort': (state, action: PayloadAction<{ field: SortField; direction: 'asc' | 'desc' }>) => {
      const { field, direction } = action.payload;
      state.sortField = field;
      state.sortDirection = direction;
    },
    'tags/setFilter': (state, action: PayloadAction<FilterEntity>) => {
      state.filterEntity = action.payload;
      state.currentPage = 1; // Reset to first page when filter changes
    },
    'tags/setSearch': (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1; // Reset to first page when search changes
    },
    'tags/selectTag': (state, action: PayloadAction<string>) => {
      const tagId = action.payload;
      const index = state.selectedTags.indexOf(tagId);
      if (index === -1) {
        state.selectedTags.push(tagId);
      } else {
        state.selectedTags.splice(index, 1);
      }
    },
    'tags/selectAllTags': (state, action: PayloadAction<string[]>) => {
      const allIds = action.payload;
      if (state.selectedTags.length === allIds.length) {
        state.selectedTags = [];
      } else {
        state.selectedTags = [...allIds];
      }
    },
    'tags/clearSelectedTags': (state) => {
      state.selectedTags = [];
    },
  }
});

// Export the actions with consistent naming
export const {
  'tags/setPage': setPage,
  'tags/setSort': setSort,
  'tags/setFilter': setFilter,
  'tags/setSearch': setSearch,
  'tags/selectTag': selectTag,
  'tags/selectAllTags': selectAllTags,
  'tags/clearSelectedTags': clearSelectedTags
} = tagsCoreSlice.actions;

// Export the core slice for configuration
export const tagsCoreSlice_ForConfiguration = tagsCoreSlice;
