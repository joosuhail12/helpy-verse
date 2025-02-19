
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Chatbot } from '@/types/chatbot';
import { mockChatbots } from '@/mock/chatbots';

interface ChatbotsState {
  items: Chatbot[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatbotsState = {
  items: mockChatbots,
  loading: false,
  error: null,
};

export const fetchChatbots = createAsyncThunk(
  'chatbots/fetchChatbots',
  async () => {
    return mockChatbots;
  }
);

export const createChatbot = createAsyncThunk(
  'chatbots/createChatbot',
  async (chatbot: Omit<Chatbot, 'id' | 'createdAt'>) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newChatbot: Chatbot = {
      ...chatbot,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    return newChatbot;
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
      })
      .addCase(createChatbot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChatbot.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.loading = false;
      })
      .addCase(createChatbot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create chatbot';
      });
  },
});

export const selectChatbots = (state: { chatbots: ChatbotsState }) => state.chatbots.items;
export const selectChatbotsLoading = (state: { chatbots: ChatbotsState }) => state.chatbots.loading;
export const selectChatbotsError = (state: { chatbots: ChatbotsState }) => state.chatbots.error;

export default chatbotsSlice.reducer;

