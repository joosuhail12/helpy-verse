
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { ChatState, Conversation, ChatMessage } from './types';

const initialState: ChatState = {
  conversations: [
    {
      id: "conv1",
      title: "Previous Conversation",
      lastMessage: "Thank you for your message. I'll help you.",
      lastMessageTimestamp: "2025-03-28T10:57:59.327Z",
      unreadCount: 0
    }
  ],
  currentConversationId: null,
  messages: {},
  loading: false,
  error: null
};

// Async thunk for creating a conversation
export const createConversation = createAsyncThunk(
  'chat/createConversation',
  async (title: string, { rejectWithValue }) => {
    try {
      // In a real app, this would call an API
      // For now, we'll just create a new conversation object
      const conversationId = uuidv4();
      const newConversation: Conversation = {
        id: conversationId,
        title: title,
        lastMessage: "How can I help you today?",
        lastMessageTimestamp: new Date().toISOString(),
        unreadCount: 0
      };
      
      return newConversation;
    } catch (error) {
      return rejectWithValue('Failed to create conversation');
    }
  }
);

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    selectConversation: (state, action: PayloadAction<string>) => {
      state.currentConversationId = action.payload;
    },
    
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      const { conversationId } = action.payload;
      
      // Initialize messages array for this conversation if it doesn't exist
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      
      // Add the message
      state.messages[conversationId].push(action.payload);
      
      // Update conversation data
      const conversationIndex = state.conversations.findIndex(c => c.id === conversationId);
      if (conversationIndex !== -1) {
        state.conversations[conversationIndex].lastMessage = action.payload.content;
        state.conversations[conversationIndex].lastMessageTimestamp = new Date().toISOString();
        
        // If this is not the current conversation, increment unread count
        if (state.currentConversationId !== conversationId) {
          state.conversations[conversationIndex].unreadCount += 1;
        }
      }
    },
    
    markConversationAsRead: (state, action: PayloadAction<string>) => {
      const conversationId = action.payload;
      const conversationIndex = state.conversations.findIndex(c => c.id === conversationId);
      
      if (conversationIndex !== -1) {
        state.conversations[conversationIndex].unreadCount = 0;
      }
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.loading = false;
        // Add the new conversation to the beginning of the array
        state.conversations.unshift(action.payload);
        // Set it as current conversation
        state.currentConversationId = action.payload.id;
        // Initialize empty messages array
        state.messages[action.payload.id] = [];
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to create conversation';
      });
  }
});

export const {
  selectConversation,
  addMessage,
  markConversationAsRead,
  setLoading,
  setError
} = chatSlice.actions;

export type { Conversation, ChatMessage };
export const chatReducer = chatSlice.reducer;
