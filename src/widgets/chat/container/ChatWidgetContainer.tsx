
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
  instanceId?: string; // Added instanceId prop
}

const ChatWidgetContainer: React.FC<ChatWidgetContainerProps> = ({ 
  onClose, 
  workspaceId,
  position = 'right',
  compact = false,
  instanceId = 'default' // Default value for the instanceId
}) => {
  const { conversations, currentConversation, selectConversation, createNewConversation, sendMessage } = useChat();
  const { colors } = useThemeContext();
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<View>('home');

  useEffect(() => {
    // Initialize chat widget
    setIsLoading(false);
  }, []);

  const handleStartConversation = useCallback((message: string) => {
    // This would typically handle sending the first message in a conversation
    console.log('Starting conversation with message:', message);
    // Move to conversation view
    setActiveView('conversation');
  }, []);

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
      />
    </div>
  );
};

export default ChatWidgetContainer;
