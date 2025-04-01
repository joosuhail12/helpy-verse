
import React, { useState, useEffect, useCallback } from 'react';
import { useThemeContext } from '@/context/ThemeContext';
import ViewManager from '../components/navigation/ViewManager';
import LoadingState from '../components/states/LoadingState';
import { ChatContext } from '@/context/ChatContext';

export type View = 'home' | 'messages' | 'conversation';

interface ChatWidgetContainerProps {
  onClose: () => void;
  workspaceId: string;
  position?: 'left' | 'right';
  compact?: boolean;
  instanceId?: string;
}

const ChatWidgetContainer: React.FC<ChatWidgetContainerProps> = ({ 
  onClose, 
  workspaceId,
  position = 'right',
  compact = false,
  instanceId = 'default'
}) => {
  const chatContext = React.useContext(ChatContext);
  const { conversations, currentConversation, selectConversation, createNewConversation, sendMessage } = 
    chatContext || { conversations: [], currentConversation: null, selectConversation: () => {}, createNewConversation: () => {}, sendMessage: () => {} };
  
  const { colors } = useThemeContext();
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<View>('home');

  useEffect(() => {
    // Initialize chat widget
    setIsLoading(false);
  }, []);

  const handleStartConversation = useCallback(async (message: string): Promise<void> => {
    // This would typically handle sending the first message in a conversation
    console.log('Starting conversation with message:', message);
    // Move to conversation view
    setActiveView('conversation');
    // Return a resolved promise to satisfy the Promise<void> return type
    return Promise.resolve();
  }, []);

  const handleSelectConversation = useCallback((conversationId: string) => {
    // Handle selecting a conversation
    selectConversation(conversationId);
    setActiveView('conversation');
  }, [selectConversation]);

  const handleStartNewConversation = useCallback(async (): Promise<void> => {
    // Handle starting a new conversation
    const conversationId = await createNewConversation();
    setActiveView('conversation');
    return Promise.resolve();
  }, [createNewConversation]);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div 
      className="flex flex-col h-full overflow-hidden"
      style={{ backgroundColor: colors.background }}
    >
      <ViewManager
        activeView={activeView}
        setActiveView={setActiveView}
        workspaceId={workspaceId}
        onClose={onClose}
        onStartConversation={handleStartConversation}
        onSelectConversation={handleSelectConversation}
        onStartNewConversation={handleStartNewConversation}
      />
    </div>
  );
};

export default ChatWidgetContainer;
