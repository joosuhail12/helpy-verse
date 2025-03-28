
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CannedResponsesState } from '../types';
import { cannedResponsesAdapter } from '../adapter';

// Create the core slice with local reducers
const cannedResponsesCoreSlice = createSlice({
  name: 'cannedResponses',
  initialState: cannedResponsesAdapter.getInitialState({
    loading: false,
    error: null,
    selectedResponseId: null,
    versionHistory: null,
    categories: []
  }),
  reducers: {
    // Select a canned response
    selectCannedResponse: (state, action: PayloadAction<string>) => {
      state.selectedResponseId = action.payload;
    },
    
    // Clear selected canned response
    clearSelectedCannedResponse: (state) => {
      state.selectedResponseId = null;
    },
    
    // Set categories
    setCategories: (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload;
    },
    
    // Set version history
    setVersionHistory: (state, action: PayloadAction<{
      responseId: string;
      versions: any[];
    } | null>) => {
      state.versionHistory = action.payload;
    }
  }
});

// Export the actions for direct usage
export const {
  selectCannedResponse,
  clearSelectedCannedResponse,
  setCategories,
  setVersionHistory
} = cannedResponsesCoreSlice.actions;

// Export the core slice for configuration in the main slice
export const cannedResponsesCoreSlice_ForConfiguration = {
  name: cannedResponsesCoreSlice.name,
  initialState: cannedResponsesCoreSlice.getInitialState(),
  reducers: cannedResponsesCoreSlice.caseReducers
};
