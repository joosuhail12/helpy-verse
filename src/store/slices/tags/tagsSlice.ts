
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Tag } from '@/types/tag';

interface TagsState {
  items: Tag[];
  loading: boolean;
  error: string | null;
  selectedTagId: string | null;
}

const initialState: TagsState = {
  items: [],
  loading: false,
  error: null,
  selectedTagId: null
};

const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    setTags: (state, action: PayloadAction<Tag[]>) => {
      state.items = action.payload;
    },
    addTag: (state, action: PayloadAction<Tag>) => {
      state.items.push(action.payload);
    },
    updateTag: (state, action: PayloadAction<Tag>) => {
      const index = state.items.findIndex(tag => tag.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteTag: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(tag => tag.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSelectedTagId: (state, action: PayloadAction<string | null>) => {
      state.selectedTagId = action.payload;
    }
  }
});

export const {
  setTags,
  addTag,
  updateTag,
  deleteTag,
  setLoading,
  setError,
  setSelectedTagId
} = tagsSlice.actions;

export default tagsSlice.reducer;
