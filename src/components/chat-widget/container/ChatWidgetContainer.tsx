
import React, { useState, useEffect, useCallback } from 'react';
import { useChat } from '@/hooks/chat/useChat';
import { useThemeContext } from '@/context/ThemeContext';
import Navigation from '../components/navigation/Navigation';
import ViewManager from '../components/navigation/ViewManager';
import LoadingState from '../components/states/LoadingState';

interface ChatWidgetContainerProps {
  onClose: () => void;
  workspaceId: string;
  position?: 'left' | 'right';
  compact?: boolean;
  instanceId?: string;
}

export type View = 'home' | 'messages' | 'conversation';

const ChatWidgetContainer: React.FC<ChatWidgetContainerProps> = ({ 
  onClose, 
  workspaceId,
  position = 'right',
  compact = false,
  instanceId = 'default'
}) => {
  const { conversations, currentConversation, selectConversation, createNewConversation } = useChat();
  const { colors } = useThemeContext();
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<View>('home');

  // Modified to not create a conversation on init
  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Function to handle starting a new conversation when user sends first message
  const handleStartConversation = useCallback(async (message: string) => {
    setIsLoading(true);
    try {
      const newConversationId = await createNewConversation(`Conversation ${new Date().toLocaleString()}`);
      selectConversation(newConversationId);
      // Now we can handle the message in the conversation component
    } catch (error) {
      console.error('Failed to create conversation:', error);
    } finally {
      setIsLoading(false);
    }
  }, [createNewConversation, selectConversation]);

  // Fix: Pass the conversation ID string instead of the conversation object
  const handleSelectConversation = useCallback((conversationId: string) => {
    selectConversation(conversationId);
  }, [selectConversation]);

  if (isLoading) {
    return <LoadingState compact={compact} />;
  }

  return (
    <div 
      className={`flex flex-col h-full text-gray-900 ${compact ? 'max-w-xs' : 'w-full'}`} 
      style={{ backgroundColor: colors.background, color: colors.foreground }}
    >
      <ViewManager
        activeView={activeView}
        setActiveView={setActiveView}
        workspaceId={workspaceId}
        onClose={onClose}
        onStartConversation={handleStartConversation}
        onSelectConversation={handleSelectConversation}
      />
      
      <Navigation activeView={activeView} setActiveView={setActiveView} />
    </div>
  );
};

export default ChatWidgetContainer;
