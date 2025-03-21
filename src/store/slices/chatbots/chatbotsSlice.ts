
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Chatbot } from '@/types/chatbot';
import { RootState } from '../../store';

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

// Async thunks
export const fetchChatbots = createAsyncThunk(
  'chatbots/fetchChatbots',
  async (_, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      const response = await fetch('/api/chatbots');
      if (!response.ok) {
        throw new Error('Failed to fetch chatbots');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createChatbot = createAsyncThunk(
  'chatbots/createChatbot',
  async (chatbot: Omit<Chatbot, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      // Replace with actual API call
      const response = await fetch('/api/chatbots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chatbot),
      });
      if (!response.ok) {
        throw new Error('Failed to create chatbot');
      }
      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const chatbotsSlice = createSlice({
  name: 'chatbots',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch chatbots
      .addCase(fetchChatbots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatbots.fulfilled, (state, action) => {
        state.loading = false;
        state.chatbots = action.payload;
      })
      .addCase(fetchChatbots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create chatbot
      .addCase(createChatbot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChatbot.fulfilled, (state, action) => {
        state.loading = false;
        state.chatbots.push(action.payload);
      })
      .addCase(createChatbot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Selectors
export const selectChatbots = (state: RootState) => state.chatbots?.chatbots || [];
export const selectChatbotsLoading = (state: RootState) => state.chatbots?.loading || false;
export const selectChatbotsError = (state: RootState) => state.chatbots?.error || null;

export const chatbotsReducer = chatbotsSlice.reducer;
