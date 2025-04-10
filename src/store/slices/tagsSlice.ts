import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Tag, SortField, FilterEntity } from "@/types/tag";
import { tagService, type TagParams } from "@/api/services/tagService";
import type { RootState } from "../store";

interface TagsState {
  items: Tag[];
  total: number;
  loading: boolean;
  error: string | null;
  currentPage: number;
  itemsPerPage: number;
  sortField: SortField;
  sortDirection: "asc" | "desc";
  filterEntity: FilterEntity;
  searchQuery: string;
  selectedTags: string[];
}

const initialState: TagsState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
  currentPage: 1,
  itemsPerPage: 10,
  sortField: "name",
  sortDirection: "asc",
  filterEntity: "all",
  searchQuery: "",
  selectedTags: [],
};

// ✅ Fetch tags with pagination and filtering
export const fetchTags = createAsyncThunk(
  "tags/fetchTags",
  async (params: TagParams) => {
    const response = await tagService.fetchTags(params);
    return {
      tags: response.data.map(tag => ({
        id: tag.id,
        name: tag.name,
        color: tag.color || "#000000", // Default color
        createdAt: tag.createdAt,
        lastUsed: tag.lastUsed || new Date().toISOString(), // Default lastUsed
        trend: tag.trend || "stable", // Default trend
        counts: tag.counts || { tickets: 0, contacts: 0, companies: 0 }, // Default counts
        history: tag.history || [], // Default empty history
        preview: tag.preview || [], // Default empty preview
      })),
      total: response.data.length,
    };
  }
);

// ✅ Create a new tag
export const createTag = createAsyncThunk(
  "tags/createTag",
  async (tag: Partial<Tag>) => {
    const response = await tagService.createTag(tag);
    return {
      tags: response.data.map(tag => ({
        id: tag.id,
        name: tag.name,
        color: tag.color || "#000000", // Default color
        createdAt: tag.createdAt,
        lastUsed: tag.lastUsed || new Date().toISOString(), // Default lastUsed
        trend: tag.trend || "stable", // Default trend
        counts: tag.counts || { tickets: 0, contacts: 0, companies: 0 }, // Default counts
        history: tag.history || [], // Default empty history
        preview: tag.preview || [], // Default empty preview
      })),
      total: response.data.length,
    };
  }
);

// ✅ Update an existing tag
export const updateTag = createAsyncThunk(
  "tags/updateTag",
  async ({ id, tag }: { id: string; tag: Partial<Tag> }) => {
    const response = await tagService.updateTag(id, tag);
    return {
      tags: response.data.map(tag => ({
        id: tag.id,
        name: tag.name,
        color: tag.color || "#000000", // Default color
        createdAt: tag.createdAt,
        lastUsed: tag.lastUsed || new Date().toISOString(), // Default lastUsed
        trend: tag.trend || "stable", // Default trend
        counts: tag.counts || { tickets: 0, contacts: 0, companies: 0 }, // Default counts
        history: tag.history || [], // Default empty history
        preview: tag.preview || [], // Default empty preview
      })),
      total: response.data.length,
    };
  }
);

// ✅ Delete multiple tags
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

// Export actions
export const {
  setPage,
  setSort,
  setFilter,
  setSearch,
  selectTag,
  selectAllTags,
  clearSelectedTags,
} = tagsSlice.actions;

// Export selectors
export const selectTags = (state: RootState) => state.tags.items;
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
