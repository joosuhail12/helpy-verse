
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useConversations } from './useConversations';
import { useMessages } from './useMessages';
import { 
  addMessage,
  ChatMessage,
  selectConversation as selectConversationAction
} from '@/store/slices/chat/chatSlice';

export const useChat = () => {
  const dispatch = useAppDispatch();
  const { loading, error, workspaceId } = useAppSelector(state => state.chat);
  
  const {
    conversations,
    currentConversation,
    createNewConversation,
    selectConversation
  } = useConversations();
  
  const { messages, sendMessage: sendMessageInternal, getMessages } = useMessages();
  
  // Wrap the sendMessage function to update the Redux store
  const sendMessage = useCallback((content: string, conversationId: string) => {
    if (!conversationId) {
      console.error('Cannot send message - no active conversation');
      return Promise.reject('No active conversation');
    }
    
    const message: ChatMessage = {
      id: uuidv4(),
      conversationId,
      content,
      sender: 'user',
      timestamp: new Date()
    };
    
    // Add to Redux store
    dispatch(addMessage(message));
    
    // Use the internal send function
    return sendMessageInternal(content, conversationId);
  }, [dispatch, sendMessageInternal]);
  
  return {
    conversations,
    currentConversation,
    createNewConversation,
    selectConversation,
    messages,
    sendMessage,
    getMessages,
    loading,
    error,
    workspaceId
  };
};
