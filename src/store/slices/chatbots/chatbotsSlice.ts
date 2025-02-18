
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Chatbot } from '@/types/chatbot';
import { mockChatbots } from '@/mock/chatbots';

interface ChatbotsState {
  items: Chatbot[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatbotsState = {
  items: mockChatbots, // Initially using mock data, replace with API call
  loading: false,
  error: null,
};

export const fetchChatbots = createAsyncThunk(
  'chatbots/fetchChatbots',
  async () => {
    // TODO: Replace with actual API call
    return mockChatbots;
  }
);

const chatbotsSlice = createSlice({
  name: 'chatbots',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatbots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatbots.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchChatbots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch chatbots';
      });
  },
});

export const selectChatbots = (state: { chatbots: ChatbotsState }) => state.chatbots.items;
export const selectChatbotsLoading = (state: { chatbots: ChatbotsState }) => state.chatbots.loading;
export const selectChatbotsError = (state: { chatbots: ChatbotsState }) => state.chatbots.error;

export default chatbotsSlice.reducer;
