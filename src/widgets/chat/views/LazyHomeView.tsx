
import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { View } from '../types';

const HomeViewLazy = React.lazy(() => import('./HomeView'));

interface LazyHomeViewProps {
  workspaceId: string;
  onStartNewConversation: () => void;
  onSelectConversation: (conversationId: string) => void;
  setActiveView: (view: View) => void;
  onClose: () => void;
}

const LazyHomeView: React.FC<LazyHomeViewProps> = (props) => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <HomeViewLazy {...props} />
    </Suspense>
  );
};

export default LazyHomeView;
