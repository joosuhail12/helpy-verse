import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Message } from '@/components/chat-widget/components/conversation/types';
import { initializeAbly, sendMessage, subscribeToConversation } from '@/utils/ablyChat';

// Chat widget state interface
interface ChatState {
  isConnected: boolean;
  connectionState: 'initializing' | 'connected' | 'disconnected' | 'failed';
  currentConversationId: string | null;
  conversations: Record<string, {
    messages: Message[];
    isLoading: boolean;
    hasMoreMessages: boolean;
    totalCount: number;
  }>;
  unreadCount: number;
  error: string | null;
}

const initialState: ChatState = {
  isConnected: false,
  connectionState: 'initializing',
  currentConversationId: null,
  conversations: {},
  unreadCount: 0,
  error: null
};

// Async thunks
export const initializeAblyConnection = createAsyncThunk(
  'chat/initializeAbly',
  async (_, { rejectWithValue }) => {
    try {
      const ablyClient = await initializeAbly();
      return { status: ablyClient.connection.state };
    } catch (error) {
      console.error('Failed to initialize Ably:', error);
      return rejectWithValue('Failed to establish real-time connection');
    }
  }
);

export const fetchConversationMessages = createAsyncThunk(
  'chat/fetchMessages',
  async ({ 
    conversationId, 
    page = 1, 
    limit = 20 
  }: { 
    conversationId: string; 
    page?: number; 
    limit?: number; 
  }, { rejectWithValue }) => {
    try {
      // Simulate API fetch for now - this would be replaced with actual API call
      await new Promise(resolve => setTimeout(resolve, 100)); // Low latency simulation
      
      // Generate mock messages with pagination
      const totalCount = 35;
      const startIndex = Math.max(0, totalCount - (page * limit));
      const endIndex = Math.max(0, totalCount - ((page - 1) * limit));
      
      const messages: Message[] = [];
      for (let i = startIndex; i < endIndex; i++) {
        const isAgentMessage = i % 2 === 0;
        messages.push({
          id: `msg-${i}`,
          text: isAgentMessage 
            ? `Message #${i + 1}` 
            : `User message #${i + 1}`,
          sender: isAgentMessage ? 'agent' : 'user',
          timestamp: new Date(Date.now() - (i * 300000)).toISOString()
        });
      }
      
      return { 
        conversationId,
        messages,
        hasMoreMessages: startIndex > 0,
        totalCount
      };
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      return rejectWithValue('Failed to load conversation messages');
    }
  }
);

export const sendChatMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ 
    conversationId, 
    text, 
    userId 
  }: { 
    conversationId: string; 
    text: string; 
    userId: string;
  }, { rejectWithValue }) => {
    try {
      await sendMessage(
        conversationId,
        text,
        {
          id: userId,
          name: 'Customer',
          type: 'customer'
        }
      );
      
      // Create message object
      const message: Message = {
        id: `msg-${Date.now()}`,
        text,
        sender: 'user',
        timestamp: new Date().toISOString()
      };
      
      return { conversationId, message };
    } catch (error) {
      console.error('Failed to send message:', error);
      return rejectWithValue('Failed to send message');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConnectionState: (state, action: PayloadAction<'initializing' | 'connected' | 'disconnected' | 'failed'>) => {
      state.connectionState = action.payload;
      state.isConnected = action.payload === 'connected';
    },
    setCurrentConversation: (state, action: PayloadAction<string | null>) => {
      state.currentConversationId = action.payload;
    },
    addMessage: (state, action: PayloadAction<{ conversationId: string; message: Message }>) => {
      const { conversationId, message } = action.payload;
      
      if (!state.conversations[conversationId]) {
        state.conversations[conversationId] = {
          messages: [],
          isLoading: false,
          hasMoreMessages: false,
          totalCount: 0
        };
      }
      
      // Add message only if it doesn't already exist
      const messageExists = state.conversations[conversationId].messages.some(
        m => m.id === message.id
      );
      
      if (!messageExists) {
        state.conversations[conversationId].messages.push(message);
        state.conversations[conversationId].totalCount++;
        
        // Increment unread count if not the current conversation
        if (conversationId !== state.currentConversationId && message.sender === 'agent') {
          state.unreadCount++;
        }
      }
    },
    markConversationAsRead: (state, action: PayloadAction<string>) => {
      const conversationId = action.payload;
      // Reset unread count when user opens a conversation
      state.unreadCount = 0;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Initialize Ably connection
      .addCase(initializeAblyConnection.pending, (state) => {
        state.connectionState = 'initializing';
      })
      .addCase(initializeAblyConnection.fulfilled, (state, action) => {
        state.isConnected = action.payload.status === 'connected';
        state.connectionState = action.payload.status === 'connected' ? 'connected' : 'disconnected';
        state.error = null;
      })
      .addCase(initializeAblyConnection.rejected, (state, action) => {
        state.connectionState = 'failed';
        state.isConnected = false;
        state.error = action.payload as string;
      })
      
      // Fetch messages
      .addCase(fetchConversationMessages.pending, (state, action) => {
        const { conversationId } = action.meta.arg;
        
        if (!state.conversations[conversationId]) {
          state.conversations[conversationId] = {
            messages: [],
            isLoading: true,
            hasMoreMessages: false,
            totalCount: 0
          };
        } else {
          state.conversations[conversationId].isLoading = true;
        }
      })
      .addCase(fetchConversationMessages.fulfilled, (state, action) => {
        const { conversationId, messages, hasMoreMessages, totalCount } = action.payload;
        
        if (!state.conversations[conversationId]) {
          state.conversations[conversationId] = {
            messages: [],
            isLoading: false,
            hasMoreMessages: false,
            totalCount: 0
          };
        }
        
        // If we're loading the first page, replace messages
        // Otherwise, prepend the older messages
        const currentPage = action.meta.arg.page || 1;
        
        if (currentPage === 1) {
          state.conversations[conversationId].messages = messages;
        } else {
          // Prepend older messages
          // First check for duplicates
          const existingMsgIds = new Set(state.conversations[conversationId].messages.map(m => m.id));
          const newMessages = messages.filter(msg => !existingMsgIds.has(msg.id));
          
          state.conversations[conversationId].messages = [...newMessages, ...state.conversations[conversationId].messages];
        }
        
        state.conversations[conversationId].isLoading = false;
        state.conversations[conversationId].hasMoreMessages = hasMoreMessages;
        state.conversations[conversationId].totalCount = totalCount;
      })
      .addCase(fetchConversationMessages.rejected, (state, action) => {
        const { conversationId } = action.meta.arg;
        
        if (state.conversations[conversationId]) {
          state.conversations[conversationId].isLoading = false;
        }
        
        state.error = action.payload as string;
      })
      
      // Send message
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        const { conversationId, message } = action.payload;
        
        if (!state.conversations[conversationId]) {
          state.conversations[conversationId] = {
            messages: [message],
            isLoading: false,
            hasMoreMessages: false,
            totalCount: 1
          };
        } else {
          // Add message only if it doesn't already exist
          const messageExists = state.conversations[conversationId].messages.some(
            m => m.id === message.id
          );
          
          if (!messageExists) {
            state.conversations[conversationId].messages.push(message);
            state.conversations[conversationId].totalCount++;
          }
        }
      });
  }
});

export const { 
  setConnectionState, 
  setCurrentConversation, 
  addMessage, 
  markConversationAsRead,
  clearError
} = chatSlice.actions;

export default chatSlice.reducer;
