
import { createSlice } from '@reduxjs/toolkit';

export type SecurityState = {
  sessions: any[];
  twoFactorEnabled: boolean;
  loading: boolean;
  error: string | null;
};

const initialState: SecurityState = {
  sessions: [],
  twoFactorEnabled: false,
  loading: false,
  error: null,
};

const securitySlice = createSlice({
  name: 'security',
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export const securityReducer = securitySlice.reducer;
