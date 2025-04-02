
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { ChatState, Conversation, ChatMessage } from './types';

const initialState: ChatState = {
  conversations: [],
  currentConversationId: null,
  messages: {},
  loading: false,
  error: null
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    selectConversation: (state, action: PayloadAction<string>) => {
      state.currentConversationId = action.payload;
    },
    
    createConversation: (state, action: PayloadAction<string>) => {
      const newConversation: Conversation = {
        id: uuidv4(),
        title: action.payload || `Conversation ${new Date().toLocaleString()}`,
        lastMessage: '',
        lastMessageTimestamp: new Date().toISOString(),
        unreadCount: 0
      };
      
      state.conversations.unshift(newConversation);
      state.currentConversationId = newConversation.id;
      state.messages[newConversation.id] = [];
      
      return state;
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
        state.conversations[conversationIndex].lastMessageTimestamp = action.payload.timestamp.toISOString();
        
        // If this is not the current conversation, increment unread count
        if (state.currentConversationId !== conversationId) {
          state.conversations[conversationIndex].unreadCount += 1;
        }
      }
      
      return state;
    },
    
    markConversationAsRead: (state, action: PayloadAction<string>) => {
      const conversationId = action.payload;
      const conversationIndex = state.conversations.findIndex(c => c.id === conversationId);
      
      if (conversationIndex !== -1) {
        state.conversations[conversationIndex].unreadCount = 0;
      }
      
      return state;
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
      return state;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      return state;
    }
  }
});

export const {
  selectConversation,
  createConversation,
  addMessage,
  markConversationAsRead,
  setLoading,
  setError
} = chatSlice.actions;

export const chatReducer = chatSlice.reducer;
