
import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

const ConversationView = React.lazy(() => import('./ConversationView'));

interface LazyConversationViewProps {
  onBack: () => void;
  onClose: () => void;
  conversationId: string;
  workspaceId: string;
}

const LazyConversationView: React.FC<LazyConversationViewProps> = (props) => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <ConversationView {...props} />
    </Suspense>
  );
};

export default LazyConversationView;
