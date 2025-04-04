
import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

const MessagesViewLazy = React.lazy(() => import('./MessagesView'));

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
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    }>
      <MessagesViewLazy {...props} />
    </Suspense>
  );
};

export default LazyMessagesView;
