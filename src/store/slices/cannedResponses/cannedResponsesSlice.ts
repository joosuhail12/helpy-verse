
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CannedResponsesState, CannedResponse } from './types';
import { 
  fetchCannedResponses, 
  fetchCannedResponseById, 
  createCannedResponse,
  updateCannedResponse,
  deleteCannedResponse
} from './actions';

// Define initial state
const initialState: CannedResponsesState = {
  responses: [],
  selectedResponse: null,
  loading: false,
  error: null
};

// Create cannedResponses slice
const cannedResponsesSlice = createSlice({
  name: 'cannedResponses',
  initialState,
  reducers: {
    // Select a canned response
    selectCannedResponse: (state, action: PayloadAction<string>) => {
      const response = state.responses.find(r => r.id === action.payload);
      state.selectedResponse = response || null;
    },
    
    // Clear selected canned response
    clearSelectedCannedResponse: (state) => {
      state.selectedResponse = null;
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
        if (action.payload) { // Check if payload exists
          state.responses = action.payload;
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
          const index = state.responses.findIndex(r => r.id === action.payload.id);
          if (index !== -1) {
            state.responses[index] = action.payload;
          } else {
            state.responses.push(action.payload);
          }
          state.selectedResponse = action.payload;
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
        state.responses.push(action.payload);
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
        const index = state.responses.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.responses[index] = action.payload;
        }
        if (state.selectedResponse && state.selectedResponse.id === action.payload.id) {
          state.selectedResponse = action.payload;
        }
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
        state.responses = state.responses.filter(response => response.id !== action.meta.arg);
        if (state.selectedResponse && state.selectedResponse.id === action.meta.arg) {
          state.selectedResponse = null;
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
