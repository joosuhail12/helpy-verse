
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { mockChatbots } from '@/mock/chatbots';
import type { Chatbot } from '@/types/chatbot';

// Define the state interface
interface ChatbotsState {
  chatbots: Chatbot[];
  loading: boolean;
  error: string | null;
}

// Define initial state
const initialState: ChatbotsState = {
  chatbots: [],
  loading: false,
  error: null,
};

// Create async thunks
export const fetchChatbots = createAsyncThunk(
  'chatbots/fetchChatbots',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, we would fetch from an API
      // For now, return mock data
      return mockChatbots;
    } catch (error) {
      return rejectWithValue('Failed to fetch chatbots');
    }
  }
);

export const createChatbot = createAsyncThunk(
  'chatbots/createChatbot',
  async (chatbot: Partial<Chatbot>, { rejectWithValue }) => {
    try {
      // In a real app, we would send to an API
      // For now, return mock data with generated ID
      const newChatbot: Chatbot = {
        ...chatbot,
        id: Date.now().toString(),
        status: chatbot.status || 'inactive',
        createdAt: new Date().toISOString(),
      } as Chatbot;
      
      return newChatbot;
    } catch (error) {
      return rejectWithValue('Failed to create chatbot');
    }
  }
);

export const updateChatbot = createAsyncThunk(
  'chatbots/updateChatbot',
  async ({ id, data }: { id: string; data: Partial<Chatbot> }, { rejectWithValue }) => {
    try {
      // In a real app, we would send to an API
      // For now, return mock data
      return { id, ...data };
    } catch (error) {
      return rejectWithValue('Failed to update chatbot');
    }
  }
);

// Create the slice
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
      .addCase(createChatbot.fulfilled, (state, action: PayloadAction<Chatbot>) => {
        state.loading = false;
        state.chatbots.push(action.payload);
      })
      .addCase(createChatbot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update chatbot
      .addCase(updateChatbot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateChatbot.fulfilled, (state, action) => {
        state.loading = false;
        const { id } = action.payload;
        const index = state.chatbots.findIndex((chatbot) => chatbot.id === id);
        if (index !== -1) {
          state.chatbots[index] = { ...state.chatbots[index], ...action.payload };
        }
      })
      .addCase(updateChatbot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export selectors
export const selectChatbots = (state: RootState) => state.chatbots.chatbots;
export const selectChatbotsLoading = (state: RootState) => state.chatbots.loading;
export const selectChatbotsError = (state: RootState) => state.chatbots.error;

// Export the reducer
export const chatbotsReducer = chatbotsSlice.reducer;
