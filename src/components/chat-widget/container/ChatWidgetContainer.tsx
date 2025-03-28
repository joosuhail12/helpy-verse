
import React, { useState, useEffect } from 'react';
import { useChat } from '@/context/ChatContext';
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
  const { 
    conversations, 
    currentConversation, 
    createNewConversation: createConversation, 
    selectConversation: setSelectedConversation
  } = useChat();
  
  const { colors } = useThemeContext();
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<View>('home');

  // Function to handle starting a new conversation when user sends first message
  const handleStartConversation = async (message: string) => {
    setIsLoading(true);
    try {
      const newConversationId = await createConversation(`Conversation ${new Date().toLocaleString()}`);
      setSelectedConversation(newConversationId);
      setActiveView('conversation');
    } catch (error) {
      console.error('Failed to create conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
          setActiveView={setActiveView} 
        />
      }
      
      {activeView === 'messages' && 
        <MessagesView 
          workspaceId={workspaceId} 
          onClose={onClose} 
          setActiveView={setActiveView} 
          onStartConversation={handleStartConversation}
        />
      }
      
      {activeView === 'conversation' && currentConversation && 
        <ConversationView 
          conversationId={currentConversation.id} 
          onBack={() => setActiveView('messages')} 
        />
      }
      
      <Navigation activeView={activeView} setActiveView={setActiveView} />
    </div>
  );
};

export default ChatWidgetContainer;
