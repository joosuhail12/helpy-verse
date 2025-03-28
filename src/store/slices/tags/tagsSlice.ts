
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { tagService } from '@/api/tagsApi';
import { RootState } from '@/store/store';

export interface Tag {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

interface TagsState {
  entities: Record<string, Tag>;
  ids: string[];
  loading: boolean;
  error: string | null;
}

const initialState: TagsState = {
  entities: {},
  ids: [],
  loading: false,
  error: null
};

export const fetchTags = createAsyncThunk(
  'tags/fetchTags',
  async (_, { rejectWithValue }) => {
    try {
      const response = await tagService.getTags();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch tags');
    }
  }
);

export const createTag = createAsyncThunk(
  'tags/createTag',
  async (tagData: Partial<Tag>, { rejectWithValue }) => {
    try {
      const response = await tagService.createTag(tagData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create tag');
    }
  }
);

export const updateTag = createAsyncThunk(
  'tags/updateTag',
  async ({ tagId, data }: { tagId: string; data: Partial<Tag> }, { rejectWithValue }) => {
    try {
      const response = await tagService.updateTag(tagId, data);
      return { tagId, data: response.data };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update tag');
    }
  }
);

export const deleteTag = createAsyncThunk(
  'tags/deleteTag',
  async (tagId: string, { rejectWithValue }) => {
    try {
      await tagService.deleteTag(tagId);
      return tagId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete tag');
    }
  }
);

const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    clearTags: (state) => {
      state.entities = {};
      state.ids = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchTags
      .addCase(fetchTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.loading = false;
        
        // Normalize tags data
        const entities: Record<string, Tag> = {};
        const ids: string[] = [];
        
        action.payload.forEach((tag: Tag) => {
          entities[tag.id] = tag;
          ids.push(tag.id);
        });
        
        state.entities = entities;
        state.ids = ids;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Handle createTag
      .addCase(createTag.fulfilled, (state, action) => {
        const newTag = action.payload;
        state.entities[newTag.id] = newTag;
        state.ids.push(newTag.id);
      })
      
      // Handle updateTag
      .addCase(updateTag.fulfilled, (state, action) => {
        if (action.payload) {
          const { tagId, data } = action.payload;
          state.entities[tagId] = { ...state.entities[tagId], ...data };
        }
      })
      
      // Handle deleteTag
      .addCase(deleteTag.fulfilled, (state, action) => {
        const tagId = action.payload;
        delete state.entities[tagId];
        state.ids = state.ids.filter(id => id !== tagId);
      });
  }
});

export const { clearTags } = tagsSlice.actions;

// Selectors
export const selectAllTags = (state: RootState) => 
  state.tags.ids.map(id => state.tags.entities[id]);

export const selectTagById = (state: RootState, tagId: string) => 
  state.tags.entities[tagId];

export const selectTagsLoading = (state: RootState) => state.tags.loading;
export const selectTagsError = (state: RootState) => state.tags.error;

export default tagsSlice.reducer;
