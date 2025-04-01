
import React, { createContext, useContext } from 'react';
import { useConversations } from '@/hooks/chat/useConversations';
import { useMessages } from '@/hooks/chat/useMessages';

export const ChatContext = createContext<any | undefined>(undefined);

interface ChatProviderProps {
  children: React.ReactNode;
  workspaceId: string;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children, workspaceId }) => {
  const { 
    conversations, 
    currentConversation, 
    createNewConversation, 
    selectConversation 
  } = useConversations();

  // Helper to update conversation with newest message
  const updateConversationWithMessage = React.useCallback((conversationId: string, message: string) => {
    // This would typically update the conversation's last message and timestamp
    // For now, we're just passing this function to useMessages
    // The actual implementation would depend on how conversations are stored and updated
  }, []);

  const { 
    messages, 
    loadingMessages, 
    sendMessage, 
    getMessages 
  } = useMessages(updateConversationWithMessage);

  const value = {
    workspaceId,
    conversations,
    currentConversation,
    createNewConversation,
    selectConversation,
    messages,
    loadingMessages,
    sendMessage,
    getMessages,
  };
  
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatContext;
