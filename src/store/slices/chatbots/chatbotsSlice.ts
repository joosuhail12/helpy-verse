
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Chatbot } from '@/types/chatbot';
import type { QueryGroup } from '@/types/queryBuilder';
import { mockChatbots } from '@/mock/chatbots';

interface ChatbotsState {
  items: Chatbot[];
  loading: boolean;
  error: string | null;
  currentChatbot: Chatbot | null;
}

const initialState: ChatbotsState = {
  items: mockChatbots,
  loading: false,
  error: null,
  currentChatbot: null,
};

export const fetchChatbots = createAsyncThunk(
  'chatbots/fetchChatbots',
  async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
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

export const updateChatbotAudienceRules = createAsyncThunk(
  'chatbots/updateAudienceRules',
  async ({ chatbotId, rules }: { chatbotId: string; rules: QueryGroup }) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return { chatbotId, rules };
  }
);

const chatbotsSlice = createSlice({
  name: 'chatbots',
  initialState,
  reducers: {
    setCurrentChatbot: (state, action) => {
      state.currentChatbot = action.payload;
    },
    clearCurrentChatbot: (state) => {
      state.currentChatbot = null;
    },
  },
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
      })
      .addCase(updateChatbotAudienceRules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateChatbotAudienceRules.fulfilled, (state, action) => {
        const chatbot = state.items.find(c => c.id === action.payload.chatbotId);
        if (chatbot) {
          chatbot.audienceRules = action.payload.rules;
        }
        state.loading = false;
      })
      .addCase(updateChatbotAudienceRules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update audience rules';
      });
  },
});

export const { setCurrentChatbot, clearCurrentChatbot } = chatbotsSlice.actions;

export const selectChatbots = (state: { chatbots: ChatbotsState }) => state.chatbots.items;
export const selectChatbotsLoading = (state: { chatbots: ChatbotsState }) => state.chatbots.loading;
export const selectChatbotsError = (state: { chatbots: ChatbotsState }) => state.chatbots.error;
export const selectCurrentChatbot = (state: { chatbots: ChatbotsState }) => state.chatbots.currentChatbot;

export default chatbotsSlice.reducer;

