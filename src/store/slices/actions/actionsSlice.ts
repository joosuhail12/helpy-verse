
import { createSlice } from '@reduxjs/toolkit';

export type ActionsState = {
  actions: any[];
  loading: boolean;
  error: string | null;
};

const initialState: ActionsState = {
  actions: [],
  loading: false,
  error: null,
};

const actionsSlice = createSlice({
  name: 'actions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export const actionsReducer = actionsSlice.reducer;
