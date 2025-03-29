
import React from 'react';
import { View } from '../../container/ChatWidgetContainer';
import HomeView from '../../views/HomeView';
import MessagesView from '../../views/MessagesView';
import ConversationView from '../conversation/ConversationView';
import { useChat } from '@/hooks/chat/useChat';

interface ViewManagerProps {
  activeView: View;
  setActiveView: (view: View) => void;
  workspaceId: string;
  onClose: () => void;
  onStartConversation: (message: string) => Promise<void>;
}

/**
 * Component to manage which view is currently displayed in the chat widget
 */
const ViewManager: React.FC<ViewManagerProps> = ({
  activeView,
  setActiveView,
  workspaceId,
  onClose,
  onStartConversation
}) => {
  const { currentConversation } = useChat();
  
  return (
    <>
      {activeView === 'home' && (
        <HomeView 
          workspaceId={workspaceId} 
          onClose={onClose} 
          setActiveView={(view: View) => setActiveView(view)} 
        />
      )}
      
      {activeView === 'messages' && (
        <MessagesView 
          workspaceId={workspaceId} 
          onClose={onClose} 
          setActiveView={(view: View) => setActiveView(view)} 
          onStartConversation={onStartConversation}
        />
      )}
      
      {activeView === 'conversation' && currentConversation && (
        <ConversationView 
          conversationId={currentConversation.id} 
          workspaceId={workspaceId} 
          onBack={() => setActiveView('messages')} 
        />
      )}
    </>
  );
};

export default ViewManager;
