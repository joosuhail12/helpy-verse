
import React, { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';
import { View } from '../types';

// Lazy load the MessagesView component
const MessagesViewComponent = lazy(() => import('./MessagesView'));

interface LazyMessagesViewProps {
  onSelectConversation: () => void;
  onClose: () => void;
  onStartConversation?: (message: string) => Promise<void> | void;
  workspaceId?: string;
  setActiveView?: (view: View | string) => void;
}

/**
 * Unified LazyMessagesView that works across the application
 */
const LazyMessagesView: React.FC<LazyMessagesViewProps> = (props) => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <MessagesViewComponent
        onSelectConversation={props.onSelectConversation}
        onClose={props.onClose}
        onStartConversation={props.onStartConversation}
        workspaceId={props.workspaceId}
        setActiveView={props.setActiveView as (view: View) => void}
      />
    </Suspense>
  );
};

export default LazyMessagesView;
