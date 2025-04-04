
import { createSlice } from '@reduxjs/toolkit';
import { CannedResponsesState } from './types';
import { buildCannedResponsesExtraReducers } from './extraReducers';
import { cannedResponsesAdapter } from './adapter';
import { cannedResponsesCoreSlice_ForConfiguration } from './actions/cannedResponsesCore';

// Define the initial state using adapter's getInitialState
const initialState: CannedResponsesState = cannedResponsesAdapter.getInitialState({
  loading: false,
  error: null,
  selectedResponseId: null,
  versionHistory: null,
  categories: []
});

// Create the slice by extending the core slice with async reducers
const cannedResponsesSlice = createSlice({
  name: 'cannedResponses',
  initialState,
  reducers: {
    ...cannedResponsesCoreSlice_ForConfiguration.reducers,
  },
  extraReducers: (builder) => buildCannedResponsesExtraReducers(builder)
});

// Export the actions from the dedicated actions files
export * from './actions';

// Export adapter selectors
export {
  selectAllCannedResponses,
  selectCannedResponseById,
  selectCannedResponseIds
} from './adapter';

// Export the reducer
export const cannedResponsesReducer = cannedResponsesSlice.reducer;
