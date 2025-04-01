
import React, { createContext } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { useChat } from '@/hooks/chat/useChat';

export const ChatContext = createContext<ReturnType<typeof useChat> | undefined>(undefined);

interface ChatProviderProps {
  children: React.ReactNode;
  workspaceId: string;
}

/**
 * Chat Provider Component that wraps the children with Redux Provider and ChatContext
 */
export const ChatProvider: React.FC<ChatProviderProps> = ({ children, workspaceId }) => {
  // We need to wrap the components in a Redux Provider
  // After that, the useChat hook can access the store
  return (
    <Provider store={store}>
      <InnerChatProvider workspaceId={workspaceId}>
        {children}
      </InnerChatProvider>
    </Provider>
  );
};

/**
 * Inner provider that depends on Redux to be available
 */
const InnerChatProvider: React.FC<ChatProviderProps> = ({ children, workspaceId }) => {
  const chatContextValue = useChat();
  
  return (
    <ChatContext.Provider value={{ ...chatContextValue, workspaceId }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
