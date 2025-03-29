
import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { useChat } from '@/hooks/chat/useChat';
import { useThemeContext } from '@/context/ThemeContext';
import HomeView from '../views/HomeView';
import MessagesView from '../views/MessagesView';
import ConversationView from '../components/conversation/ConversationView';
import Navigation from '../components/navigation/Navigation';
import SampleConversation from '../components/conversation/SampleConversation';
import { useRenderTime } from '@/hooks/usePerformanceOptimization';

interface ChatWidgetContainerProps {
  onClose: () => void;
  workspaceId: string;
  position?: 'left' | 'right';
  compact?: boolean;
  isPreview?: boolean;
  sampleMessages?: boolean;
  initialView?: 'home' | 'messages' | 'conversation';
}

export type View = 'home' | 'messages' | 'conversation';

// Memoize child components
const MemoizedHomeView = memo(HomeView);
const MemoizedMessagesView = memo(MessagesView);
const MemoizedConversationView = memo(ConversationView);
const MemoizedNavigation = memo(Navigation);
const MemoizedSampleConversation = memo(SampleConversation);

const ChatWidgetContainer: React.FC<ChatWidgetContainerProps> = ({ 
  onClose, 
  workspaceId,
  position = 'right',
  compact = false,
  isPreview = false,
  sampleMessages = false,
  initialView = 'home'
}) => {
  // Track render time in development
  useRenderTime('ChatWidgetContainer');
  
  const { conversations, currentConversation, selectConversation, createNewConversation } = useChat();
  const { colors, features, labels, styles } = useThemeContext();
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<View>(initialView);

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

  // Memoize view change handler
  const handleViewChange = useCallback((view: View) => {
    setActiveView(view);
  }, []);

  // Memoize the container background style
  const containerStyle = useMemo(() => ({ 
    backgroundColor: colors.background, 
    color: colors.foreground, 
    fontFamily: styles?.fontFamily 
  }), [colors.background, colors.foreground, styles?.fontFamily]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full text-gray-900 w-full" style={containerStyle}>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-t-transparent rounded-full" 
            style={{ borderColor: colors.primary, borderTopColor: 'transparent' }}></div>
        </div>
      </div>
    );
  }

  // If this is a preview with sample messages, show a sample conversation
  if (isPreview && sampleMessages) {
    return (
      <div className="flex flex-col h-full text-gray-900 w-full" style={containerStyle}>
        <MemoizedSampleConversation 
          onClose={onClose} 
          position={position} 
          compact={compact} 
          headerTitle={labels.headerTitle}
          headerColor={colors.headerBackground}
          currentView={activeView}
          onChangeView={handleViewChange}
          userMessageColor={colors.userMessage}
          agentMessageColor={colors.agentMessage}
          messageBoxColor={colors.inputBackground}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full text-gray-900 w-full" style={containerStyle}>
      {activeView === 'home' && 
        <MemoizedHomeView 
          workspaceId={workspaceId} 
          onClose={onClose} 
          setActiveView={handleViewChange} 
        />
      }
      
      {activeView === 'messages' && 
        <MemoizedMessagesView 
          workspaceId={workspaceId} 
          onClose={onClose} 
          setActiveView={handleViewChange} 
          onStartConversation={handleStartConversation}
        />
      }
      
      {activeView === 'conversation' && currentConversation && 
        <MemoizedConversationView 
          conversationId={currentConversation.id} 
          workspaceId={workspaceId} 
          onBack={() => handleViewChange('messages')} 
        />
      }
      
      <MemoizedNavigation activeView={activeView} setActiveView={handleViewChange} />
    </div>
  );
};

export default memo(ChatWidgetContainer);
