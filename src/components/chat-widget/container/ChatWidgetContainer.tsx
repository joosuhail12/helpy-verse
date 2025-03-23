
import React, { useState, useEffect } from 'react';
import { useChat } from '@/hooks/chat/useChat';
import { useThemeContext } from '@/context/ThemeContext';
import HomeView from '../views/HomeView';
import MessagesView from '../views/MessagesView';
import Navigation from '../components/navigation/Navigation';

interface ChatWidgetContainerProps {
  onClose: () => void;
  workspaceId: string;
}

type View = 'home' | 'messages';

const ChatWidgetContainer: React.FC<ChatWidgetContainerProps> = ({ onClose, workspaceId }) => {
  const { conversations, currentConversation, createNewConversation } = useChat();
  const { colors } = useThemeContext();
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<View>('home');

  useEffect(() => {
    const initializeChat = async () => {
      if (!currentConversation && conversations.length === 0) {
        await createNewConversation(`Conversation ${Date.now()}`);
      }
      setIsLoading(false);
    };

    initializeChat();
  }, [currentConversation, conversations, createNewConversation]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-white text-gray-900" style={{ backgroundColor: colors.background, color: colors.foreground }}>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" 
            style={{ borderColor: colors.primary, borderTopColor: 'transparent' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white text-gray-900" style={{ backgroundColor: colors.background, color: colors.foreground }}>
      {activeView === 'home' && <HomeView workspaceId={workspaceId} onClose={onClose} />}
      {activeView === 'messages' && <MessagesView workspaceId={workspaceId} onClose={onClose} />}
      
      <Navigation activeView={activeView} setActiveView={setActiveView} />
    </div>
  );
};

export default ChatWidgetContainer;
