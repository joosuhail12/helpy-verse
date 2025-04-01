import React, { lazy, Suspense } from 'react';
import { View } from '../../types';
import { Loader2 } from 'lucide-react';
import { useChat } from '@/hooks/chat/useChat';

// Lazy loaded views
const LazyHomeView = lazy(() => import('../../views/LazyHomeView'));
const LazyMessagesView = lazy(() => import('../../views/LazyMessagesView'));
const LazyConversationView = lazy(() => import('../../views/LazyConversationView'));

interface ViewManagerProps {
  activeView: View;
  setActiveView: (view: View) => void;
  workspaceId: string;
  onClose: () => void;
  onStartConversation: (message: string) => void;
}

const ViewManager: React.FC<ViewManagerProps> = ({
  activeView,
  setActiveView,
  workspaceId,
  onClose,
  onStartConversation
}) => {
  const { currentConversation } = useChat();
  
  return (
    <div className="flex-1 overflow-hidden">
      <Suspense fallback={
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }>
        {activeView === 'home' && (
          <LazyHomeView 
            workspaceId={workspaceId}
            onStartNewConversation={() => {
              // If message is provided, start conversation with that message
              // Otherwise just create a new conversation
              setActiveView('conversation');
              onStartConversation("");
            }}
            onSelectConversation={(conversationId: string) => {
              setActiveView('conversation');
              // Handle conversation selection
            }}
            setActiveView={setActiveView}
            onClose={onClose}
          />
        )}
        
        {activeView === 'messages' && (
          <LazyMessagesView 
            onSelectConversation={() => setActiveView('conversation')}
            onClose={onClose}
            onStartConversation={onStartConversation}
          />
        )}
        
        {activeView === 'conversation' && (
          <LazyConversationView 
            onBack={() => setActiveView('messages')}
            onClose={onClose}
          />
        )}
      </Suspense>
    </div>
  );
};

export default ViewManager;
