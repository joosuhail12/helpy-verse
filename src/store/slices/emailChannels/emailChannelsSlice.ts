
import { createSlice } from '@reduxjs/toolkit';

export type EmailChannelsState = {
  channels: any[];
  defaultChannel: string | null;
  hasDomainVerified: boolean;
  loading: boolean;
  error: string | null;
};

const initialState: EmailChannelsState = {
  channels: [],
  defaultChannel: null,
  hasDomainVerified: false,
  loading: false,
  error: null,
};

const emailChannelsSlice = createSlice({
  name: 'emailChannels',
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export const emailChannelsReducer = emailChannelsSlice.reducer;
