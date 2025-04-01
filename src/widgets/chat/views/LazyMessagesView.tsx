
import React, { Suspense } from 'react';
import MessagesView from './MessagesView';
import { Loader2 } from 'lucide-react';
import { View } from '../types';

interface LazyMessagesViewProps {
  onSelectConversation: () => void;
  onClose: () => void;
  onStartConversation: (message: string) => void;
  workspaceId?: string;
  setActiveView?: (view: View) => void;
}

const LazyMessagesView: React.FC<LazyMessagesViewProps> = (props) => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full w-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <MessagesView {...props} />
    </Suspense>
  );
};

export default LazyMessagesView;
