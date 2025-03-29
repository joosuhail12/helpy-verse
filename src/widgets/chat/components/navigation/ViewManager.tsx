
import React, { lazy, Suspense } from 'react';
import { View } from '../../types';
import { Loader2 } from 'lucide-react';

// Lazy loaded views
const LazyHomeView = lazy(() => import('../../views/LazyHomeView'));
const LazyMessagesView = lazy(() => import('../../views/LazyMessagesView'));
const LazyConversationView = lazy(() => import('../../components/conversation/LazyConversationView'));

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
  return (
    <div className="flex-1 overflow-hidden">
      <Suspense fallback={
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }>
        {activeView === 'home' && (
          <LazyHomeView 
            onStartConversation={onStartConversation} 
            onViewMessages={() => setActiveView('messages')}
            onClose={onClose}
          />
        )}
        
        {activeView === 'messages' && (
          <LazyMessagesView 
            onSelectConversation={() => setActiveView('conversation')}
            onClose={onClose}
          />
        )}
        
        {activeView === 'conversation' && (
          <LazyConversationView 
            workspaceId={workspaceId}
            onBack={() => setActiveView('messages')}
            onClose={onClose}
          />
        )}
      </Suspense>
    </div>
  );
};

export default ViewManager;
