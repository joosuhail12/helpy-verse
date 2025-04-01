
import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import MessagesView from '@/widgets/chat/views/MessagesView';
import { View } from '@/widgets/chat/types';

interface LazyMessagesViewProps {
  workspaceId: string;
  onClose: () => void;
  setActiveView: (view: string) => void;
  onStartConversation: (message: string) => Promise<void>;
}

/**
 * Lazy-loaded MessagesView component with loading fallback
 */
const LazyMessagesView: React.FC<LazyMessagesViewProps> = (props) => {
  // Create a handler for the onSelectConversation that properly works with the function from props.setActiveView
  const handleSelectConversation = () => {
    props.setActiveView('conversation');
  };

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    }>
      <MessagesView
        workspaceId={props.workspaceId}
        onClose={props.onClose}
        setActiveView={props.setActiveView as (view: View) => void}
        onStartConversation={props.onStartConversation}
        onSelectConversation={handleSelectConversation}
      />
    </Suspense>
  );
};

export default LazyMessagesView;
