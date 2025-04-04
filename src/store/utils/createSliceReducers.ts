
import { ActionReducerMapBuilder, PayloadAction } from '@reduxjs/toolkit';

export interface StandardEntityState<T> {
  items: T[];
  loading: boolean;
  error: string | null;
  selectedId?: string | null;
  selected?: T | null;
  lastFetchTime?: number | null;
}

/**
 * Add standard reducers to a slice builder
 */
export const addStandardReducers = <T extends { id: string }>(
  builder: ActionReducerMapBuilder<StandardEntityState<T>>,
  thunks: {
    fetchAll: any;
    fetchById?: any;
    create?: any;
    update?: any;
    delete?: any;
  }
) => {
  // FetchAll reducers
  builder.addCase(thunks.fetchAll.pending, (state) => {
    state.loading = true;
    state.error = null;
  });
  
  builder.addCase(thunks.fetchAll.fulfilled, (state, action) => {
    state.loading = false;
    state.items = action.payload;
    state.lastFetchTime = Date.now();
  });
  
  builder.addCase(thunks.fetchAll.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload as string;
  });

  // FetchById reducers (if provided)
  if (thunks.fetchById) {
    builder.addCase(thunks.fetchById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    
    builder.addCase(thunks.fetchById.fulfilled, (state, action) => {
      state.loading = false;
      state.selected = action.payload;
      
      // Also update in items array if it exists
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      } else {
        state.items.push(action.payload);
      }
    });
    
    builder.addCase(thunks.fetchById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  }

  // Create reducers (if provided)
  if (thunks.create) {
    builder.addCase(thunks.create.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    
    builder.addCase(thunks.create.fulfilled, (state, action) => {
      state.loading = false;
      state.items.push(action.payload);
    });
    
    builder.addCase(thunks.create.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  }

  // Update reducers (if provided)
  if (thunks.update) {
    builder.addCase(thunks.update.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    
    builder.addCase(thunks.update.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      if (state.selected?.id === action.payload.id) {
        state.selected = action.payload;
      }
    });
    
    builder.addCase(thunks.update.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  }

  // Delete reducers (if provided)
  if (thunks.delete) {
    builder.addCase(thunks.delete.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    
    builder.addCase(thunks.delete.fulfilled, (state, action) => {
      state.loading = false;
      state.items = state.items.filter(item => item.id !== action.payload);
      if (state.selected?.id === action.payload) {
        state.selected = null;
      }
    });
    
    builder.addCase(thunks.delete.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  }
};
