
import React, { Suspense } from 'react';
import MessagesView from './MessagesView';
import { Loader2 } from 'lucide-react';

interface LazyMessagesViewProps {
  onSelectConversation: () => void;
  onClose: () => void;
  onStartConversation: (message: string) => void;
}

const LazyMessagesView: React.FC<LazyMessagesViewProps> = ({
  onSelectConversation,
  onClose,
  onStartConversation
}) => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <MessagesView
        onSelectConversation={onSelectConversation}
        onClose={onClose}
        onStartConversation={onStartConversation}
      />
    </Suspense>
  );
};

export default LazyMessagesView;
