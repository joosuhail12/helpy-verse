
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { 
  selectConversation as selectConversationAction,
  createConversation,
  markConversationAsRead,
  Conversation
} from '@/store/slices/chat/chatSlice';

interface UseConversationsReturn {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  createNewConversation: (title?: string) => Promise<string>;
  selectConversation: (conversationId: string) => void;
}

export const useConversations = (): UseConversationsReturn => {
  const dispatch = useAppDispatch();
  const { conversations, currentConversationId } = useAppSelector(state => state.chat);
  
  // Get current conversation
  const currentConversation = currentConversationId
    ? conversations.find(conv => conv.id === currentConversationId) || null
    : null;

  // Select a conversation
  const selectConversation = useCallback((conversationId: string) => {
    dispatch(selectConversationAction(conversationId));
    dispatch(markConversationAsRead(conversationId));
  }, [dispatch]);

  // Create a new conversation
  const createNewConversation = useCallback(async (title?: string): Promise<string> => {
    try {
      const conversationTitle = title || `Conversation ${new Date().toLocaleString()}`;
      const action = await dispatch(createConversation(conversationTitle));
      
      // Extract the conversation ID from the action payload
      if (action.payload && 'id' in action.payload) {
        const conversationId = action.payload.id;
        return conversationId;
      }
      
      // Fallback if we can't get the ID from the action payload
      return uuidv4();
    } catch (error) {
      console.error('Error creating conversation:', error);
      return Promise.reject(error);
    }
  }, [dispatch]);

  return {
    conversations,
    currentConversation,
    createNewConversation,
    selectConversation
  };
};
