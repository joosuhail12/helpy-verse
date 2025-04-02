
import React, { lazy, Suspense } from 'react';
import { View } from '../../types';
import { Loader2 } from 'lucide-react';
import { useChat } from '@/hooks/chat/useChat';
import PoweredByFooter from '../footer/PoweredByFooter';
import Navigation from './Navigation';

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
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-hidden">
        <Suspense fallback={
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }>
          {activeView === 'home' && (
            <LazyHomeView 
              workspaceId={workspaceId}
              onStartNewConversation={() => setActiveView('messages')}
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
              workspaceId={workspaceId}
              setActiveView={setActiveView}
            />
          )}
          
          {activeView === 'conversation' && currentConversation && (
            <LazyConversationView 
              onBack={() => setActiveView('messages')}
              onClose={onClose}
              conversationId={currentConversation.id || ''}
              workspaceId={workspaceId}
            />
          )}
        </Suspense>
      </div>

      {/* Footer container with navigation and powered by footer */}
      <div className="mt-auto">
        {/* Navigation bar should be on home and messages views */}
        {(activeView === 'home' || activeView === 'messages') && (
          <Navigation activeView={activeView} setActiveView={setActiveView} />
        )}

        {/* PoweredByFooter always appears at the bottom after navigation */}
        <PoweredByFooter />
      </div>
    </div>
  );
};

export default ViewManager;
