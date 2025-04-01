import { useCallback } from 'react';
import { Conversation, ChatMessage } from '@/components/chat-widget/components/conversation/types';
import { useConversations } from './useConversations';
import { useMessages } from './useMessages';

interface UseChatReturn {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  createNewConversation: (title?: string, type?: string) => Promise<string>;
  selectConversation: (conversationId: string) => void;
  sendMessage: (conversationId: string, message: string) => Promise<void>;
  getMessages: (conversationId: string) => Promise<ChatMessage[]>;
  loadingMessages: boolean;
  messages: ChatMessage[];
}

export const useChat = (): UseChatReturn => {
  const { 
    conversations, 
    currentConversation, 
    createNewConversation, 
    selectConversation 
  } = useConversations();

  // Helper to update conversation with newest message
  const updateConversationWithMessage = useCallback((conversationId: string, message: string) => {
    const updatedConversations = conversations.map(conv => 
      conv.id === conversationId ? {
        ...conv,
        lastMessage: message,
        lastMessageTimestamp: new Date().toISOString()
      } : conv
    );
    
    // This hook will handle persisting the updated conversations
    // We're just updating the state in the useConversations hook
  }, [conversations]);

  const { 
    messages, 
    loadingMessages, 
    sendMessage, 
    getMessages 
  } = useMessages(updateConversationWithMessage);

  return {
    conversations,
    currentConversation,
    createNewConversation,
    selectConversation,
    sendMessage,
    getMessages,
    loadingMessages,
    messages
  };
};
