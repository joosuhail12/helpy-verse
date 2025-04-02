
import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { View } from '../container/ChatWidgetContainer';

const HomeViewLazy = React.lazy(() => import('./HomeView'));

interface LazyHomeViewProps {
  workspaceId: string;
  onClose: () => void;
  setActiveView: (view: View) => void;
  onSelectConversation: (conversationId: string) => void;
  onStartNewConversation: () => void;
}

/**
 * Lazy-loaded HomeView component with loading fallback
 */
const LazyHomeView: React.FC<LazyHomeViewProps> = (props) => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    }>
      <HomeViewLazy {...props} />
    </Suspense>
  );
};

export default LazyHomeView;
