
import { useCallback } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { 
  selectConversation as selectConversationAction,
  createConversation as createConversationAction,
  addMessage as addMessageAction,
  markConversationAsRead as markConversationAsReadAction
} from '@/store/slices/chat/chatSlice';
import { v4 as uuidv4 } from 'uuid';

export const useChat = () => {
  const dispatch = useAppDispatch();
  const conversations = useAppSelector(state => state.chat.conversations);
  const currentConversationId = useAppSelector(state => state.chat.currentConversationId);
  const messages = useAppSelector(state => state.chat.messages);
  const loading = useAppSelector(state => state.chat.loading);
  const error = useAppSelector(state => state.chat.error);

  // Get the current conversation object
  const currentConversation = currentConversationId 
    ? conversations.find(c => c.id === currentConversationId) 
    : null;
  
  // Select a conversation
  const selectConversation = useCallback((conversationId: string) => {
    dispatch(selectConversationAction(conversationId));
    dispatch(markConversationAsReadAction(conversationId));
  }, [dispatch]);
  
  // Create a new conversation
  const createNewConversation = useCallback((title?: string) => {
    const action = dispatch(createConversationAction(title || ''));
    const newId = action.payload;
    return newId;
  }, [dispatch]);
  
  // Get messages for a conversation
  const getMessages = useCallback((conversationId: string) => {
    return Promise.resolve(messages[conversationId] || []);
  }, [messages]);
  
  // Send a message
  const sendMessage = useCallback((conversationId: string, content: string) => {
    const message = {
      id: uuidv4(),
      conversationId,
      content,
      sender: 'user' as const,
      timestamp: new Date(),
      status: 'sent' as const
    };
    
    dispatch(addMessageAction(message));
    
    // Simulate agent response after a delay
    setTimeout(() => {
      const agentMessage = {
        id: uuidv4(),
        conversationId,
        content: `This is an automated response to: "${content}"`,
        sender: 'agent' as const,
        timestamp: new Date(),
        status: 'sent' as const
      };
      
      dispatch(addMessageAction(agentMessage));
    }, 1000);
    
    return Promise.resolve();
  }, [dispatch]);
  
  return {
    conversations,
    currentConversation,
    currentConversationId,
    messages,
    loading,
    error,
    selectConversation,
    createNewConversation,
    getMessages,
    sendMessage
  };
};
