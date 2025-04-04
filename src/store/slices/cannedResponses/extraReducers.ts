
import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { CannedResponsesState } from './types';
import { cannedResponsesAdapter } from './adapter';
import {
  fetchCannedResponses,
  createCannedResponse,
  updateCannedResponse,
  deleteCannedResponse,
  fetchCannedResponseById
} from './actions/cannedResponsesApi';

// Build the extra reducers for async operations
export const buildCannedResponsesExtraReducers = (builder: ActionReducerMapBuilder<CannedResponsesState>) => {
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
};
