
import { createSlice, createEntityAdapter, PayloadAction, EntityAdapter } from '@reduxjs/toolkit';
import { CannedResponsesState } from './types';
import { CannedResponse } from '@/mock/cannedResponses';
import { 
  fetchCannedResponses, 
  createCannedResponse,
  updateCannedResponse,
  deleteCannedResponse,
  fetchCannedResponseById
} from './actions';

// Create the entity adapter
const cannedResponsesAdapter: EntityAdapter<CannedResponse, string> = createEntityAdapter<CannedResponse, string>({
  // Select the id of the entity
  selectId: (response: CannedResponse) => response.id,
  // Keep the "all IDs" array sorted based on creation date (newest first)
  sortComparer: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
});

// Define initial state using adapter's getInitialState
const initialState: CannedResponsesState = cannedResponsesAdapter.getInitialState({
  loading: false,
  error: null,
  selectedResponseId: null,
  versionHistory: null,
  categories: []
});

// Create cannedResponses slice
const cannedResponsesSlice = createSlice({
  name: 'cannedResponses',
  initialState,
  reducers: {
    // Select a canned response
    selectCannedResponse: (state, action: PayloadAction<string>) => {
      state.selectedResponseId = action.payload;
    },
    
    // Clear selected canned response
    clearSelectedCannedResponse: (state) => {
      state.selectedResponseId = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch canned responses
      .addCase(fetchCannedResponses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCannedResponses.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          // Use the adapter to set all responses
          cannedResponsesAdapter.setAll(state, action.payload);
        }
      })
      .addCase(fetchCannedResponses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch canned responses';
      })
      
      // Fetch canned response by ID
      .addCase(fetchCannedResponseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCannedResponseById.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          // Use the adapter to upsert a single response
          cannedResponsesAdapter.upsertOne(state, action.payload);
          state.selectedResponseId = action.payload.id;
        }
      })
      .addCase(fetchCannedResponseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch canned response';
      })
      
      // Create canned response
      .addCase(createCannedResponse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCannedResponse.fulfilled, (state, action) => {
        state.loading = false;
        // Use the adapter to add one response
        cannedResponsesAdapter.addOne(state, action.payload);
      })
      .addCase(createCannedResponse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create canned response';
      })
      
      // Update canned response
      .addCase(updateCannedResponse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCannedResponse.fulfilled, (state, action) => {
        state.loading = false;
        // Use the adapter to update one response
        cannedResponsesAdapter.updateOne(state, {
          id: action.payload.id,
          changes: action.payload
        });
      })
      .addCase(updateCannedResponse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update canned response';
      })
      
      // Delete canned response
      .addCase(deleteCannedResponse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCannedResponse.fulfilled, (state, action) => {
        state.loading = false;
        // Use the adapter to remove one response
        cannedResponsesAdapter.removeOne(state, action.meta.arg);
        if (state.selectedResponseId === action.meta.arg) {
          state.selectedResponseId = null;
        }
      })
      .addCase(deleteCannedResponse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete canned response';
      });
  }
});

// Export actions and reducer
export const { selectCannedResponse, clearSelectedCannedResponse } = cannedResponsesSlice.actions;
export const cannedResponsesReducer = cannedResponsesSlice.reducer;

// Export the entity adapter selectors
export const {
  selectAll: selectAllCannedResponses,
  selectById: selectCannedResponseById,
  selectIds: selectCannedResponseIds,
} = cannedResponsesAdapter.getSelectors();
