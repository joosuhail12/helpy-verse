
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { 
  addMessage,
  ChatMessage
} from '@/store/slices/chat/chatSlice';

interface UseMessagesReturn {
  messages: Record<string, ChatMessage[]>;
  loadingMessages: boolean;
  sendMessage: (content: string, conversationId: string) => Promise<void>;
  getMessages: (conversationId: string) => ChatMessage[];
}

export const useMessages = (): UseMessagesReturn => {
  const dispatch = useAppDispatch();
  const { messages: allMessages, loading } = useAppSelector(state => state.chat);
  
  const sendMessage = useCallback(async (content: string, conversationId: string): Promise<void> => {
    // User message
    const userMessage: ChatMessage = {
      id: uuidv4(),
      conversationId,
      content,
      sender: 'user',
      timestamp: new Date()
    };
    
    // Add user message to the store
    dispatch(addMessage(userMessage));
    
    try {
      // Simulate a delay for the agent response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Agent response
      const agentMessage: ChatMessage = {
        id: uuidv4(),
        conversationId,
        content: 'Thank you for your message. How can I assist you further?',
        sender: 'agent',
        timestamp: new Date()
      };
      
      // Add agent message to the store
      dispatch(addMessage(agentMessage));
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error sending message:', error);
      return Promise.reject(error);
    }
  }, [dispatch]);
  
  const getMessages = useCallback((conversationId: string): ChatMessage[] => {
    return allMessages[conversationId] || [];
  }, [allMessages]);
  
  return {
    messages: allMessages,
    loadingMessages: loading,
    sendMessage,
    getMessages
  };
};
