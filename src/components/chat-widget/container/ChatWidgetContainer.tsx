
import React, { useState, useEffect, useCallback } from 'react';
import { useChat } from '@/hooks/chat/useChat';
import { useThemeContext } from '@/context/ThemeContext';
import ViewManager from '../components/navigation/ViewManager';
import LoadingState from '../components/states/LoadingState';

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
  // Get chat context
  const { conversations, currentConversation, selectConversation, createNewConversation, sendMessage } = useChat();
  
  // UI state
  const { colors } = useThemeContext();
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<View>('home');

  // Initialize the widget
  useEffect(() => {
    // Initialize chat widget
    setIsLoading(false);
  }, []);

  // Handle starting a conversation with a message
  const handleStartConversation = useCallback(async (message: string): Promise<void> => {
    try {
      // Create a new conversation if needed
      if (!currentConversation) {
        const conversationId = await createNewConversation();
        // Send the initial message
        await sendMessage(message, conversationId);
      } else {
        // Send message to current conversation
        await sendMessage(message, currentConversation.id);
      }
      
      // Move to conversation view
      setActiveView('conversation');
      return Promise.resolve();
    } catch (error) {
      console.error('Error starting conversation:', error);
      return Promise.reject(error);
    }
  }, [currentConversation, createNewConversation, sendMessage]);

  // Handle selecting a conversation
  const handleSelectConversation = useCallback((conversationId: string) => {
    selectConversation(conversationId);
    setActiveView('conversation');
  }, [selectConversation]);

  // Handle starting a new conversation
  const handleStartNewConversation = useCallback(async (): Promise<void> => {
    try {
      console.log('Creating new conversation');
      const conversationId = await createNewConversation();
      console.log('Created conversation with ID:', conversationId);
      setActiveView('conversation');
      return Promise.resolve();
    } catch (error) {
      console.error('Error creating new conversation:', error);
      return Promise.reject(error);
    }
  }, [createNewConversation]);

  // Show loading state while initializing
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
