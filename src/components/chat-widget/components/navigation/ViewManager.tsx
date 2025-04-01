
import React from 'react';
import { View } from '../../container/ChatWidgetContainer';
import { useChat } from '@/hooks/chat/useChat';
import LazyHomeView from '../../views/LazyHomeView';
import LazyMessagesView from '../../views/LazyMessagesView';
import LazyConversationView from '../conversation/LazyConversationView';

interface ViewManagerProps {
  activeView: View;
  setActiveView: (view: View) => void;
  workspaceId: string;
  onClose: () => void;
  onStartConversation: (message: string) => Promise<void>;
  onSelectConversation: (conversationId: string) => void;
}

/**
 * Component to manage which view is currently displayed in the chat widget
 * Uses lazy-loaded components for better initial load performance
 */
const ViewManager: React.FC<ViewManagerProps> = ({
  activeView,
  setActiveView,
  workspaceId,
  onClose,
  onStartConversation,
  onSelectConversation
}) => {
  const { currentConversation } = useChat();
  
  return (
    <>
      {activeView === 'home' && (
        <LazyHomeView 
          workspaceId={workspaceId} 
          onClose={onClose} 
          setActiveView={(view: View) => setActiveView(view)} 
          onSelectConversation={onSelectConversation}
          onStartNewConversation={() => onStartConversation('')}
        />
      )}
      
      {activeView === 'messages' && (
        <LazyMessagesView 
          workspaceId={workspaceId} 
          onClose={onClose} 
          setActiveView={(view: View) => setActiveView(view)} 
          onStartConversation={onStartConversation}
        />
      )}
      
      {activeView === 'conversation' && currentConversation && (
        <LazyConversationView 
          conversationId={currentConversation.id} 
          workspaceId={workspaceId} 
          onBack={() => setActiveView('messages')} 
        />
      )}
    </>
  );
};

export default ViewManager;
