
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
  onStartNewConversation: () => Promise<void>;
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
  onSelectConversation,
  onStartNewConversation
}) => {
  const { currentConversation } = useChat();
  
  return (
    <>
      {activeView === 'home' && (
        <LazyHomeView 
          workspaceId={workspaceId} 
          onClose={onClose} 
          setActiveView={setActiveView} 
          onSelectConversation={onSelectConversation}
          onStartNewConversation={onStartNewConversation}
        />
      )}
      
      {activeView === 'messages' && (
        <LazyMessagesView 
          workspaceId={workspaceId} 
          onClose={onClose} 
          setActiveView={setActiveView} 
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
