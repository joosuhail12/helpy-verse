
import React, { useState, useEffect, useCallback } from 'react';
import { useChat } from '@/hooks/chat/useChat';
import { useThemeContext } from '@/context/ThemeContext';
import HomeView from '../views/HomeView';
import MessagesView from '../views/MessagesView';
import ConversationView from '../components/conversation/ConversationView';
import Navigation from '../components/navigation/Navigation';

interface ChatWidgetContainerProps {
  onClose: () => void;
  workspaceId: string;
  position?: 'left' | 'right';
  compact?: boolean;
}

export type View = 'home' | 'messages' | 'conversation';

const ChatWidgetContainer: React.FC<ChatWidgetContainerProps> = ({ 
  onClose, 
  workspaceId,
  position = 'right',
  compact = false 
}) => {
  const { conversations, currentConversation, setCurrentConversation, createNewConversation } = useChat();
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
      const newConversation = await createNewConversation(`Conversation ${new Date().toLocaleString()}`);
      setCurrentConversation(newConversation);
      // Now we can handle the message in the conversation component
    } catch (error) {
      console.error('Failed to create conversation:', error);
    } finally {
      setIsLoading(false);
    }
  }, [createNewConversation, setCurrentConversation]);

  if (isLoading) {
    return (
      <div className={`flex flex-col h-full text-gray-900 ${compact ? 'max-w-xs' : 'w-full'}`} 
        style={{ backgroundColor: colors.background, color: colors.foreground }}>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-t-transparent rounded-full" 
            style={{ borderColor: colors.primary, borderTopColor: 'transparent' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full text-gray-900 ${compact ? 'max-w-xs' : 'w-full'}`} 
      style={{ backgroundColor: colors.background, color: colors.foreground }}>
      {activeView === 'home' && 
        <HomeView 
          workspaceId={workspaceId} 
          onClose={onClose} 
          setActiveView={(view: View) => setActiveView(view)} 
        />
      }
      
      {activeView === 'messages' && 
        <MessagesView 
          workspaceId={workspaceId} 
          onClose={onClose} 
          setActiveView={(view: View) => setActiveView(view)} 
          onStartConversation={handleStartConversation}
        />
      }
      
      {activeView === 'conversation' && currentConversation && 
        <ConversationView 
          conversationId={currentConversation.id} 
          workspaceId={workspaceId} 
          onBack={() => setActiveView('messages')} 
        />
      }
      
      <Navigation activeView={activeView} setActiveView={setActiveView} />
    </div>
  );
};

export default ChatWidgetContainer;
