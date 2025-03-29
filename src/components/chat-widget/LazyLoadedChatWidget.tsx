
import React, { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Lazy load the ChatWidget component with proper handling for named export
const ChatWidget = lazy(() => 
  import('./ChatWidget').then(module => ({ 
    default: module.ChatWidget 
  }))
);

// Loading fallback component
const ChatWidgetLoader = () => (
  <div className="flex h-full w-full items-center justify-center bg-white/50 rounded-xl">
    <Loader2 className="h-6 w-6 animate-spin text-primary" />
  </div>
);

// Props type should match the original ChatWidget component
interface LazyLoadedChatWidgetProps {
  workspaceId: string;
  theme?: any;
  settings?: any;
  isPreview?: boolean;
  showLauncher?: boolean;
  sampleMessages?: boolean;
}

/**
 * LazyLoadedChatWidget - A wrapper component that lazy loads the ChatWidget
 * This prevents the ChatWidget from being included in the initial bundle
 */
const LazyLoadedChatWidget: React.FC<LazyLoadedChatWidgetProps> = (props) => {
  return (
    <Suspense fallback={<ChatWidgetLoader />}>
      <ChatWidget {...props} />
    </Suspense>
  );
};

export default LazyLoadedChatWidget;
