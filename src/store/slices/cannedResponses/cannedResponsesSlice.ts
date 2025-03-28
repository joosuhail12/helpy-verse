
import { createSlice } from '@reduxjs/toolkit';
import { cannedResponsesCoreSlice_ForConfiguration } from './actions/cannedResponsesCore';
import {
  fetchCannedResponses,
  createCannedResponse,
  updateCannedResponse,
  deleteCannedResponse
} from './actions/cannedResponsesApi';

// Create the slice
const cannedResponsesSlice = createSlice({
  ...cannedResponsesCoreSlice_ForConfiguration,
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
          state.responses = action.payload;
        }
      })
      .addCase(fetchCannedResponses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create canned response
      .addCase(createCannedResponse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCannedResponse.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.responses.push(action.payload);
        }
      })
      .addCase(createCannedResponse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update canned response
      .addCase(updateCannedResponse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCannedResponse.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          const index = state.responses.findIndex(response => response.id === action.payload.id);
          if (index !== -1) {
            state.responses[index] = action.payload;
          }
          if (state.selectedResponse?.id === action.payload.id) {
            state.selectedResponse = action.payload;
          }
        }
      })
      .addCase(updateCannedResponse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete canned response
      .addCase(deleteCannedResponse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCannedResponse.fulfilled, (state, action) => {
        state.loading = false;
        if (action.meta.arg) {
          state.responses = state.responses.filter(response => response.id !== action.meta.arg);
          if (state.selectedResponse?.id === action.meta.arg) {
            state.selectedResponse = null;
          }
        }
      })
      .addCase(deleteCannedResponse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export * from './actions';
export const cannedResponsesReducer = cannedResponsesSlice.reducer;
