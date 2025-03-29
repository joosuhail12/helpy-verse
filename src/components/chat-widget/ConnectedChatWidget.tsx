
import React, { useEffect, Suspense, lazy } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { selectChatWidgetSettings } from '../../store/slices/chatWidgetSettings/selectors';
import { loadChatWidgetSettings } from '../../store/slices/chatWidgetSettings/actions';
import { Loader2 } from 'lucide-react';
import ToggleButton from './components/button/ToggleButton';

// Lazy load ChatWidget component
const ChatWidget = lazy(() => import('./ChatWidget').then(module => ({ default: module.ChatWidget })));

interface ConnectedChatWidgetProps {
  workspaceId: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

const ConnectedChatWidget: React.FC<ConnectedChatWidgetProps> = ({ 
  workspaceId,
  isOpen = false,
  onToggle 
}) => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectChatWidgetSettings);
  
  // Load settings from localStorage on mount
  useEffect(() => {
    dispatch(loadChatWidgetSettings());
  }, [dispatch]);

  return (
    <>
      {isOpen && (
        <Suspense fallback={
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        }>
          <ChatWidget 
            workspaceId={workspaceId} 
            settings={settings}
            onClose={onToggle}
          />
        </Suspense>
      )}
      <div className={`fixed bottom-4 z-50 ${settings?.appearance?.position === 'left' ? 'left-4' : 'right-4'}`}>
        <ToggleButton 
          isOpen={isOpen} 
          onClick={onToggle} 
        />
      </div>
    </>
  );
};

export default ConnectedChatWidget;
