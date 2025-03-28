
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CannedResponse } from '@/mock/cannedResponses';

export type CannedResponsesState = {
  responses: CannedResponse[];
  selectedResponse: CannedResponse | null;
  loading: boolean;
  error: string | null;
};

const initialState: CannedResponsesState = {
  responses: [],
  selectedResponse: null,
  loading: false,
  error: null,
};

// Create a slice for core canned response actions
const cannedResponsesCoreSlice = createSlice({
  name: 'cannedResponses',
  initialState,
  reducers: {
    'cannedResponses/setLoading': (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    'cannedResponses/setError': (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    'cannedResponses/setResponses': (state, action: PayloadAction<CannedResponse[]>) => {
      state.responses = action.payload;
    },
    'cannedResponses/addResponse': (state, action: PayloadAction<CannedResponse>) => {
      state.responses.push(action.payload);
    },
    'cannedResponses/updateResponse': (state, action: PayloadAction<CannedResponse>) => {
      const index = state.responses.findIndex(response => response.id === action.payload.id);
      if (index !== -1) {
        state.responses[index] = action.payload;
      }
    },
    'cannedResponses/deleteResponse': (state, action: PayloadAction<string>) => {
      state.responses = state.responses.filter(response => response.id !== action.payload);
    },
    'cannedResponses/selectResponse': (state, action: PayloadAction<string>) => {
      state.selectedResponse = state.responses.find(response => response.id === action.payload) || null;
    },
    'cannedResponses/clearSelectedResponse': (state) => {
      state.selectedResponse = null;
    }
  }
});

// Export the actions with consistent naming
export const {
  'cannedResponses/setLoading': setLoading,
  'cannedResponses/setError': setError,
  'cannedResponses/setResponses': setResponses,
  'cannedResponses/addResponse': addResponse,
  'cannedResponses/updateResponse': updateResponse,
  'cannedResponses/deleteResponse': deleteResponse,
  'cannedResponses/selectResponse': selectResponse,
  'cannedResponses/clearSelectedResponse': clearSelectedResponse
} = cannedResponsesCoreSlice.actions;

// Export the core slice for configuration
export const cannedResponsesCoreSlice_ForConfiguration = cannedResponsesCoreSlice;
