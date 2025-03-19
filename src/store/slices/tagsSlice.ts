
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import type { Tag, SortField, FilterEntity, TagsState } from '@/types/tag';

// Mock tag service for now
const tagService = {
  fetchTags: async (params: any) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: mockTags,
      total: mockTags.length
    };
  },
  createTag: async (tag: Partial<Tag>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const newTag: Tag = {
      id: `tag-${Math.random().toString(36).substring(2, 9)}`,
      name: tag.name || 'New Tag',
      color: tag.color || '#000000',
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
      trend: 'stable',
      counts: { tickets: 0, contacts: 0, companies: 0 },
      history: [],
      preview: []
    };
    return {
      data: [...mockTags, newTag],
      total: mockTags.length + 1
    };
  },
  updateTag: async (id: string, tag: Partial<Tag>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const updatedTags = mockTags.map(t => (t.id === id ? { ...t, ...tag } : t));
    return {
      data: updatedTags,
      total: updatedTags.length
    };
  },
  deleteTags: async (ids: string[]) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  }
};

// Mock data
export const mockTags: Tag[] = [
  {
    id: 'tag-1',
    name: 'Bug',
    color: '#ef4444',
    createdAt: '2023-01-15T08:30:00Z',
    lastUsed: '2023-07-20T14:22:00Z',
    trend: 'increasing',
    counts: { tickets: 45, contacts: 12, companies: 5 },
    history: [
      { date: '2023-01', count: 12 },
      { date: '2023-02', count: 18 },
      { date: '2023-03', count: 25 },
      { date: '2023-04', count: 32 },
      { date: '2023-05', count: 38 },
      { date: '2023-06', count: 42 },
      { date: '2023-07', count: 45 }
    ],
    preview: [
      { id: 'ticket-1', name: 'Login issue', type: 'ticket' },
      { id: 'ticket-2', name: 'Dashboard not loading', type: 'ticket' }
    ]
  },
  {
    id: 'tag-2',
    name: 'Feature Request',
    color: '#3b82f6',
    createdAt: '2023-02-10T10:15:00Z',
    lastUsed: '2023-07-18T09:45:00Z',
    trend: 'stable',
    counts: { tickets: 28, contacts: 8, companies: 3 },
    history: [
      { date: '2023-02', count: 6 },
      { date: '2023-03', count: 12 },
      { date: '2023-04', count: 18 },
      { date: '2023-05', count: 22 },
      { date: '2023-06', count: 25 },
      { date: '2023-07', count: 28 }
    ],
    preview: [
      { id: 'ticket-3', name: 'Add dark mode', type: 'ticket' },
      { id: 'ticket-4', name: 'Export to PDF', type: 'ticket' }
    ]
  },
  {
    id: 'tag-3',
    name: 'Critical',
    color: '#9333ea',
    createdAt: '2023-01-05T09:20:00Z',
    lastUsed: '2023-07-22T11:30:00Z',
    trend: 'decreasing',
    counts: { tickets: 15, contacts: 5, companies: 2 },
    history: [
      { date: '2023-01', count: 24 },
      { date: '2023-02', count: 22 },
      { date: '2023-03', count: 20 },
      { date: '2023-04', count: 18 },
      { date: '2023-05', count: 16 },
      { date: '2023-06', count: 15 },
      { date: '2023-07', count: 15 }
    ],
    preview: [
      { id: 'ticket-5', name: 'Server down', type: 'ticket' },
      { id: 'ticket-6', name: 'Payment processing error', type: 'ticket' }
    ]
  }
];

const initialState: TagsState = {
  tags: [],
  items: [],
  total: 0,
  loading: false,
  error: null,
  currentPage: 1,
  itemsPerPage: 10,
  sortField: 'name',
  sortDirection: 'asc',
  filterEntity: null,
  searchQuery: '',
  selectedTags: [],
};

export const fetchTags = createAsyncThunk(
  "tags/fetchTags",
  async (params: any) => {
    const response = await tagService.fetchTags(params);
    return {
      tags: response.data,
      total: response.total,
    };
  }
);

export const createTag = createAsyncThunk(
  "tags/createTag",
  async (tag: Partial<Tag>) => {
    const response = await tagService.createTag(tag);
    return {
      tags: response.data,
      total: response.total,
    };
  }
);

export const updateTag = createAsyncThunk(
  "tags/updateTag",
  async ({ id, tag }: { id: string; tag: Partial<Tag> }) => {
    const response = await tagService.updateTag(id, tag);
    return {
      tags: response.data,
      total: response.total,
    };
  }
);

export const deleteTags = createAsyncThunk("tags/deleteTags", async (ids: string[]) => {
  await tagService.deleteTags(ids);
  return ids;
});

const tagsSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setSort: (state, action) => {
      const { field, direction } = action.payload;
      state.sortField = field;
      state.sortDirection = direction;
    },
    setFilter: (state, action) => {
      state.filterEntity = action.payload;
      state.currentPage = 1; // Reset to first page when filter changes
    },
    setSearch: (state, action) => {
      state.searchQuery = action.payload;
      state.currentPage = 1; // Reset to first page when search changes
    },
    selectTag: (state, action) => {
      const tagId = action.payload;
      const index = state.selectedTags.indexOf(tagId);
      if (index === -1) {
        state.selectedTags.push(tagId);
      } else {
        state.selectedTags.splice(index, 1);
      }
    },
    selectAllTags: (state, action) => {
      const allIds = action.payload;
      if (state.selectedTags.length === allIds.length) {
        state.selectedTags = [];
      } else {
        state.selectedTags = allIds;
      }
    },
    clearSelectedTags: (state) => {
      state.selectedTags = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.tags;
        state.total = action.payload.total;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch tags";
      })
      .addCase(createTag.fulfilled, (state, action) => {
        state.items = action.payload.tags;
        state.total = action.payload.total;
      })
      .addCase(updateTag.fulfilled, (state, action) => {
        state.items = action.payload.tags;
        state.total = action.payload.total;
      })
      .addCase(deleteTags.fulfilled, (state, action) => {
        state.items = state.items.filter(tag => !action.payload.includes(tag.id));
        state.selectedTags = state.selectedTags.filter(id => !action.payload.includes(id));
      });
  },
});

export const {
  setPage,
  setSort,
  setFilter,
  setSearch,
  selectTag,
  selectAllTags,
  clearSelectedTags,
} = tagsSlice.actions;

// Selectors
export const selectTagsItems = (state: RootState) => state.tags.items;
export const selectTagsTotal = (state: RootState) => state.tags.total;
export const selectTagsLoading = (state: RootState) => state.tags.loading;
export const selectTagsError = (state: RootState) => state.tags.error;
export const selectTagsCurrentPage = (state: RootState) => state.tags.currentPage;
export const selectTagsItemsPerPage = (state: RootState) => state.tags.itemsPerPage;
export const selectTagsSortField = (state: RootState) => state.tags.sortField;
export const selectTagsSortDirection = (state: RootState) => state.tags.sortDirection;
export const selectTagsFilterEntity = (state: RootState) => state.tags.filterEntity;
export const selectTagsSearchQuery = (state: RootState) => state.tags.searchQuery;
export const selectSelectedTags = (state: RootState) => state.tags.selectedTags;

export default tagsSlice.reducer;
