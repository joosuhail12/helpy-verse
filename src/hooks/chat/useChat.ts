
import { useContext } from 'react';
import { ChatContext } from '@/context/ChatContext';

export const useChat = () => {
  const context = useContext(ChatContext);
  
  if (context === undefined) {
    // Provide fallback values instead of throwing error
    return {
      conversations: [],
      currentConversation: null,
      createNewConversation: () => {},
      selectConversation: () => {},
      sendMessage: () => {},
      messages: [],
      loadingMessages: false,
      getMessages: () => {},
    };
  }
  
  return context;
};
