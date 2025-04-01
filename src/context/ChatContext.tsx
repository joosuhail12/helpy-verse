
import React, { createContext, useContext, useEffect } from 'react';
import { useChat as useChatHook } from '@/hooks/chat/useChat';

interface ChatContextValue {
  conversations: any[];
  currentConversation: any | null;
  selectConversation: (id: string) => void;
  createNewConversation: (title?: string) => any;
  getMessages: (conversationId: string) => Promise<any[]>;
  sendMessage: (conversationId: string, content: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

interface ChatProviderProps {
  children: React.ReactNode;
  workspaceId: string;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children, workspaceId }) => {
  const chatHook = useChatHook();
  
  // Initialize with some mock data
  useEffect(() => {
    if (chatHook.conversations.length === 0) {
      // Create a sample conversation if none exist
      const conversationId = chatHook.createNewConversation('Welcome');
      
      // We would typically load conversations from an API here
      console.log('Initialized chat with workspace ID:', workspaceId);
    }
  }, [workspaceId, chatHook]);
  
  return (
    <ChatContext.Provider value={chatHook}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  
  return context;
};
