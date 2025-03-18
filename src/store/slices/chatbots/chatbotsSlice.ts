
import { createSlice } from '@reduxjs/toolkit';
import { Chatbot } from '@/types/chatbot';

export type ChatbotsState = {
  chatbots: Chatbot[];
  loading: boolean;
  error: string | null;
};

const initialState: ChatbotsState = {
  chatbots: [],
  loading: false,
  error: null,
};

const chatbotsSlice = createSlice({
  name: 'chatbots',
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export const chatbotsReducer = chatbotsSlice.reducer;
