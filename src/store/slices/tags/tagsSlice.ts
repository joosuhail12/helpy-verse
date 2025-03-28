
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Tag, SortField, FilterEntity } from '@/types/tag';
import { tagService } from '@/api/services/tagService';
import { RootState } from '@/store/store';

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

// Fetch tags with pagination and filtering
export const fetchTags = createAsyncThunk(
  'tags/fetchTags',
  async (params: any) => {
    try {
      const response = await tagService.fetchTags(params);
      return {
        tags: response.data,
        total: response.total || response.data.length
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch tags');
    }
  }
);

// Create a new tag
export const createTag = createAsyncThunk(
  'tags/createTag',
  async (tag: Partial<Tag>) => {
    try {
      const response = await tagService.createTag(tag);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create tag');
    }
  }
);

// Update an existing tag
export const updateTag = createAsyncThunk(
  'tags/updateTag',
  async ({ id, tag }: { id: string; tag: Partial<Tag> }) => {
    try {
      const response = await tagService.updateTag(id, tag);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update tag');
    }
  }
);

// Delete multiple tags
export const deleteTags = createAsyncThunk(
  'tags/deleteTags', 
  async (ids: string[]) => {
    try {
      await tagService.deleteTags(ids);
      return ids;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete tags');
    }
  }
);

const tagsSlice = createSlice({
  name: 'tags',
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
        state.selectedTags = [...allIds];
      }
    },
    clearSelectedTags: (state) => {
      state.selectedTags = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tags
      .addCase(fetchTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.loading = false;
        
        // Normalize data
        const newEntities: Record<string, Tag> = {};
        const newIds: string[] = [];
        
        action.payload.tags.forEach((tag: Tag) => {
          newEntities[tag.id] = tag;
          newIds.push(tag.id);
        });
        
        state.entities = newEntities;
        state.ids = newIds;
        state.total = action.payload.total;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tags';
      })
      
      // Create tag
      .addCase(createTag.fulfilled, (state, action) => {
        const newTag = action.payload;
        state.entities[newTag.id] = newTag;
        state.ids.push(newTag.id);
        state.total = state.total + 1;
      })
      
      // Update tag
      .addCase(updateTag.fulfilled, (state, action) => {
        const updatedTag = action.payload;
        state.entities[updatedTag.id] = {
          ...state.entities[updatedTag.id],
          ...updatedTag
        };
      })
      
      // Delete tags
      .addCase(deleteTags.fulfilled, (state, action) => {
        const deletedIds = action.payload;
        deletedIds.forEach(id => {
          delete state.entities[id];
        });
        state.ids = state.ids.filter(id => !deletedIds.includes(id));
        state.selectedTags = state.selectedTags.filter(id => !deletedIds.includes(id));
        state.total = state.total - deletedIds.length;
      });
  }
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

export default tagsSlice.reducer;
