
import { createSlice } from '@reduxjs/toolkit';

export type CannedResponsesState = {
  responses: any[];
  selectedResponse: any | null;
  loading: boolean;
  error: string | null;
};

const initialState: CannedResponsesState = {
  responses: [],
  selectedResponse: null,
  loading: false,
  error: null,
};

const cannedResponsesSlice = createSlice({
  name: 'cannedResponses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export const cannedResponsesReducer = cannedResponsesSlice.reducer;
