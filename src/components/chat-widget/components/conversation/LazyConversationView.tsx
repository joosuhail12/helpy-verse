
import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

const ConversationViewLazy = React.lazy(() => import('./ConversationView'));

interface LazyConversationViewProps {
  conversationId: string;
  workspaceId: string;
  onBack: () => void;
  onClose: () => void;
}

/**
 * Lazy-loaded ConversationView component with loading fallback
 */
const LazyConversationView: React.FC<LazyConversationViewProps> = (props) => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    }>
      <ConversationViewLazy {...props} />
    </Suspense>
  );
};

export default LazyConversationView;
