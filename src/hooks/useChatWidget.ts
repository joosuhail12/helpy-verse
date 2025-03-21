
import { useState, useEffect } from 'react';
import { 
  initializeAbly, 
  createConversation, 
  sendMessage,
  subscribeToConversation,
  getUserConversations,
  cleanupAblyConnection
} from '@/utils/ablyChat';

interface ChatWidgetState {
  isOpen: boolean;
  minimized: boolean;
  currentPage: 'home' | 'conversations' | 'new-chat';
  currentConversationId: string | null;
  userId: string | null;
}

/**
 * Custom hook for managing chat widget state and interactions
 */
export const useChatWidget = () => {
  const [state, setState] = useState<ChatWidgetState>({
    isOpen: false,
    minimized: false,
    currentPage: 'home',
    currentConversationId: null,
    userId: null,
  });

  // Generate a unique user ID for this session if not exists
  useEffect(() => {
    const storedUserId = localStorage.getItem('chat-widget-user-id');
    
    if (storedUserId) {
      setState(prev => ({ ...prev, userId: storedUserId }));
    } else {
      const newUserId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('chat-widget-user-id', newUserId);
      setState(prev => ({ ...prev, userId: newUserId }));
    }
  }, []);

  // Initialize Ably when widget is opened
  useEffect(() => {
    if (state.isOpen && !state.minimized) {
      initializeAbly()
        .then(() => console.log('Ably initialized for chat widget'))
        .catch(err => console.error('Failed to initialize Ably:', err));
      
      return () => {
        if (!state.isOpen) {
          cleanupAblyConnection();
        }
      };
    }
  }, [state.isOpen, state.minimized]);

  // Toggle widget open/closed
  const toggleWidget = () => {
    setState(prev => ({ 
      ...prev, 
      isOpen: !prev.isOpen,
      minimized: false 
    }));
  };

  // Minimize widget
  const minimizeWidget = () => {
    setState(prev => ({ ...prev, minimized: true }));
  };

  // Navigate to a specific page
  const navigateTo = (page: 'home' | 'conversations' | 'new-chat') => {
    setState(prev => ({ 
      ...prev, 
      currentPage: page,
      minimized: false,
      isOpen: true
    }));
  };

  // Start a new conversation
  const startConversation = async (
    name: string,
    email: string,
    topic: string,
    initialMessage: string
  ) => {
    try {
      const conversationId = await createConversation(
        name,
        email,
        topic,
        initialMessage
      );
      
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
  };

  // Send a message in the current conversation
  const sendChatMessage = async (text: string) => {
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
  };

  return {
    isOpen: state.isOpen,
    minimized: state.minimized,
    currentPage: state.currentPage,
    currentConversationId: state.currentConversationId,
    userId: state.userId,
    toggleWidget,
    minimizeWidget,
    navigateTo,
    startConversation,
    sendChatMessage
  };
};

export default useChatWidget;
