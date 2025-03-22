
import { useState, useEffect, useCallback } from 'react';
import { 
  initializeAbly, 
  subscribeToConversation,
  sendMessage,
  cleanupAblyConnection
} from '@/utils/ably';
import { v4 as uuidv4 } from 'uuid';

/**
 * Custom type for user conversation metadata
 */
interface ConversationMetadata {
  id: string;
  title: string;
  status: 'active' | 'pending' | 'resolved';
  createdAt: string;
  updatedAt: string;
  participants: Array<{
    id: string;
    name: string;
    type: 'customer' | 'agent';
  }>;
}

// Chat widget state interface
interface ChatWidgetState {
  isOpen: boolean;
  minimized: boolean;
  currentPage: 'home' | 'conversations' | 'new-chat';
  currentConversationId: string | null;
  userId: string | null;
}

// Default initial state
const initialWidgetState: ChatWidgetState = {
  isOpen: false,
  minimized: false,
  currentPage: 'home',
  currentConversationId: null,
  userId: null,
};

/**
 * Custom hook for managing chat widget state and interactions
 * Handles UI state, Ably connections, and conversation management
 */
export const useChatWidget = () => {
  // ===== STATE MANAGEMENT =====
  const [state, setState] = useState<ChatWidgetState>(initialWidgetState);
  
  // ===== USER IDENTIFICATION =====
  useEffect(() => {
    const initializeUserId = () => {
      const storedUserId = localStorage.getItem('chat-widget-user-id');
      
      if (storedUserId) {
        setState(prev => ({ ...prev, userId: storedUserId }));
      } else {
        const newUserId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('chat-widget-user-id', newUserId);
        setState(prev => ({ ...prev, userId: newUserId }));
      }
    };

    initializeUserId();
  }, []);

  // ===== ABLY CONNECTION MANAGEMENT =====
  useEffect(() => {
    if (state.isOpen && !state.minimized) {
      const setupAbly = async () => {
        try {
          await initializeAbly();
          console.log('Ably initialized for chat widget');
        } catch (err) {
          console.error('Failed to initialize Ably:', err);
        }
      };
      
      setupAbly();
      
      return () => {
        if (!state.isOpen) {
          cleanupAblyConnection();
        }
      };
    }
  }, [state.isOpen, state.minimized]);

  // ===== UI INTERACTION HANDLERS =====
  const toggleWidget = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      isOpen: !prev.isOpen,
      minimized: false 
    }));
  }, []);

  const minimizeWidget = useCallback(() => {
    setState(prev => ({ ...prev, minimized: true }));
  }, []);

  const navigateTo = useCallback((page: 'home' | 'conversations' | 'new-chat') => {
    setState(prev => ({ 
      ...prev, 
      currentPage: page,
      minimized: false,
      isOpen: true
    }));
  }, []);

  // ===== CONVERSATION MANAGEMENT =====
  const startConversation = useCallback(async (
    name: string,
    email: string,
    topic: string,
    initialMessage: string
  ) => {
    try {
      // Generate a new conversation ID
      const conversationId = `conv-${Date.now()}-${uuidv4().slice(0, 8)}`;
      
      // Create the conversation channel
      const { publishToChannel } = await import('@/utils/ably/channelService');
      
      // Publish the initial conversation data
      await publishToChannel('new-conversations', 'create', {
        conversationId,
        customerName: name,
        customerEmail: email,
        topic,
        initialMessage,
        timestamp: new Date().toISOString()
      });
      
      setState(prev => ({ 
        ...prev, 
        currentConversationId: conversationId,
        currentPage: 'conversations'
      }));
      
      return conversationId;
    } catch (error) {
      console.error('Failed to start conversation:', error);
      throw error;
    }
  }, []);

  const getUserConversations = useCallback(async (): Promise<ConversationMetadata[]> => {
    try {
      if (!state.userId) return [];
      
      // This would be replaced with an actual API call in production
      // Mock data for demo purposes
      const conversations: ConversationMetadata[] = [
        {
          id: 'conv-1',
          title: 'Support Request',
          status: 'active', 
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          updatedAt: new Date().toISOString(),
          participants: [
            { id: state.userId, name: 'Customer', type: 'customer' },
            { id: 'agent-1', name: 'Support Agent', type: 'agent' }
          ]
        }
      ];
      
      return conversations;
    } catch (error) {
      console.error('Failed to get user conversations:', error);
      return [];
    }
  }, [state.userId]);

  const sendChatMessage = useCallback(async (text: string) => {
    if (!state.currentConversationId || !state.userId) {
      console.error('Cannot send message: No active conversation or user ID');
      return;
    }
    
    try {
      await sendMessage(
        state.currentConversationId,
        text,
        {
          id: state.userId,
          name: 'Customer', // This would be the actual user name in production
          type: 'customer'
        }
      );
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }, [state.currentConversationId, state.userId]);

  // ===== EXPORTED API =====
  return {
    // State
    isOpen: state.isOpen,
    minimized: state.minimized,
    currentPage: state.currentPage,
    currentConversationId: state.currentConversationId,
    userId: state.userId,
    
    // UI Actions
    toggleWidget,
    minimizeWidget,
    navigateTo,
    
    // Conversation Actions
    startConversation,
    sendChatMessage,
    getUserConversations
  };
};

export default useChatWidget;
