
import React, { useEffect, Suspense, lazy } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { selectChatWidgetSettings } from '../../store/slices/chatWidgetSettings/selectors';
import { loadChatWidgetSettings } from '../../store/slices/chatWidgetSettings/actions';
import { Loader2 } from 'lucide-react';

// Lazy load ChatWidget component
const ChatWidget = lazy(() => import('./ChatWidget').then(module => ({ default: module.ChatWidget })));

interface ConnectedChatWidgetProps {
  workspaceId: string;
}

const ConnectedChatWidget: React.FC<ConnectedChatWidgetProps> = ({ workspaceId }) => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectChatWidgetSettings);
  
  // Load settings from localStorage on mount
  useEffect(() => {
    dispatch(loadChatWidgetSettings());
  }, [dispatch]);

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <ChatWidget 
        workspaceId={workspaceId} 
        settings={settings}
      />
    </Suspense>
  );
};

export default ConnectedChatWidget;
