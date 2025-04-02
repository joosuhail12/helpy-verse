
import React, { useState, useEffect, useCallback } from 'react';
import { useChat } from '@/hooks/chat/useChat';
import { useThemeContext } from '@/context/ThemeContext';
import ViewManager from '../components/navigation/ViewManager';
import LoadingState from '../components/states/LoadingState';
import { useWidgetState } from '../context/WidgetStateContext';

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
  position = 'right', // Default to right
  compact = false,
  instanceId = 'default'
}) => {
  // Get widget state for additional context
  const { state } = useWidgetState();

  // Access chat context
  const chatContext = useChat();
  const { conversations, currentConversation, selectConversation, createNewConversation, sendMessage } = chatContext || {
    conversations: [],
    currentConversation: null,
    selectConversation: () => {},
    createNewConversation: async () => '',
    sendMessage: async () => {}
  };
  
  // Access theme context
  const themeContext = useThemeContext();
  const colors = themeContext?.colors || { background: '#ffffff' };
  
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<View>('home');

  useEffect(() => {
    // Initialize chat widget
    console.log('Initializing chat widget container');
    setIsLoading(false);
  }, []);

  // When a new conversation is selected, switch to conversation view
  useEffect(() => {
    if (currentConversation) {
      setActiveView('conversation');
    }
  }, [currentConversation]);

  const handleStartConversation = useCallback(async (message: string) => {
    try {
      if (createNewConversation && sendMessage) {
        const conversationId = await createNewConversation();
        if (conversationId) {
          await sendMessage(conversationId, message);
          setActiveView('conversation');
          
          // Trigger message sent event for external callbacks
          window.dispatchEvent(new CustomEvent(`chat-message-sent-${instanceId}`, {
            detail: { message: { content: message } }
          }));
        }
      }
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  }, [createNewConversation, sendMessage, instanceId]);

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
        instanceId={instanceId}
      />
    </div>
  );
};

export default ChatWidgetContainer;
