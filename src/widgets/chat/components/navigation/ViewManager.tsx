
import React, { lazy, Suspense } from 'react';
import { View } from '../../container/ChatWidgetContainer';
import { useChat } from '@/hooks/chat/useChat';
import { Loader2 } from 'lucide-react';

// Lazy load views for better performance
const HomeView = lazy(() => import('../views/HomeView'));
const MessagesView = lazy(() => import('../views/MessagesView'));
const LazyConversationView = lazy(() => import('../views/ConversationView'));

interface ViewManagerProps {
  activeView: View;
  setActiveView: (view: View) => void;
  workspaceId: string;
  onClose: () => void;
  onStartConversation: (message: string) => Promise<void>;
  instanceId?: string;
}

interface LazyConversationViewProps {
  onBack: () => void;
  onClose: () => void;
  workspaceId: string;
  conversationId: string;
  instanceId?: string;
}

const ViewManager: React.FC<ViewManagerProps> = ({
  activeView,
  setActiveView,
  workspaceId,
  onClose,
  onStartConversation,
  instanceId = 'default'
}) => {
  const chatContext = useChat();
  const { currentConversation } = chatContext || { currentConversation: null };
  
  const renderView = () => {
    switch (activeView) {
      case 'home':
        return (
          <Suspense fallback={<LoadingView />}>
            <HomeView 
              onClose={onClose} 
              onStartConversation={onStartConversation}
              onViewMessages={() => setActiveView('messages')}
              workspaceId={workspaceId}
            />
          </Suspense>
        );
        
      case 'messages':
        return (
          <Suspense fallback={<LoadingView />}>
            <MessagesView 
              onBack={() => setActiveView('home')} 
              onClose={onClose}
              workspaceId={workspaceId}
            />
          </Suspense>
        );
        
      case 'conversation':
        if (currentConversation?.id) {
          return (
            <Suspense fallback={<LoadingView />}>
              <LazyConversationView 
                onBack={() => setActiveView('messages')} 
                onClose={onClose}
                workspaceId={workspaceId}
                conversationId={currentConversation.id}
                instanceId={instanceId}
              />
            </Suspense>
          );
        }
        return <LoadingView />;
        
      default:
        return <LoadingView />;
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      {renderView()}
    </div>
  );
};

const LoadingView = () => (
  <div className="flex items-center justify-center h-full">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

export default ViewManager;
