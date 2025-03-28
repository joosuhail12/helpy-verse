
import { createSlice } from '@reduxjs/toolkit';
import { tagsCoreSlice_ForConfiguration } from './actions/tagsCore';
import { fetchTags, createTag, updateTag, deleteTags } from './actions/tagsApi';

// Create the slice
const tagsSlice = createSlice({
  ...tagsCoreSlice_ForConfiguration,
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
        const newEntities: Record<string, any> = {};
        const newIds: string[] = [];
        
        action.payload.tags.forEach((tag: any) => {
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

// Export actions and reducer
export * from './actions';
export default tagsSlice.reducer;
