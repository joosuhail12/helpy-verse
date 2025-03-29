
import React, { useState, Suspense, lazy } from 'react';
import { ChatWidgetSettings } from '@/store/slices/chatWidgetSettings/types';
import { Loader2 } from 'lucide-react';
import '@/styles/chat-widget-theme.css';

// Lazy load the widget container
const ChatWidgetWrapper = lazy(() => import('./components/wrapper/ChatWidgetWrapper'));
const ChatWidgetContainer = lazy(() => import('./container/ChatWidgetContainer'));

interface ChatWidgetProps {
  workspaceId: string;
  settings?: Partial<ChatWidgetSettings>;
  onClose?: () => void;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ 
  workspaceId, 
  settings,
  onClose
}) => {
  const combinedTheme = {
    position: settings?.appearance?.position || 'right',
    compact: Boolean(settings?.appearance?.compact),
    colors: {
      primary: settings?.appearance?.primaryColor || '#9b87f5'
    },
    labels: {
      welcomeTitle: settings?.content?.welcomeTitle || 'Hello there.',
      welcomeSubtitle: settings?.content?.welcomeSubtitle || 'How can we help?'
    },
    features: {
      typingIndicator: settings?.features?.enableTypingIndicator !== false,
      reactions: settings?.features?.enableReactions !== false,
      fileAttachments: settings?.features?.enableFileAttachments !== false,
      readReceipts: settings?.features?.enableReadReceipts !== false
    }
  };

  return (
    <Suspense fallback={
      <div className="fixed bottom-20 right-4 rounded-xl shadow-lg bg-white p-4 z-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <ChatWidgetWrapper 
        isOpen={true}
        position={combinedTheme.position === 'left' ? 'left' : 'right'}
        compact={Boolean(combinedTheme.compact)}
      >
        <ChatWidgetContainer 
          onClose={onClose} 
          workspaceId={workspaceId} 
          position={combinedTheme.position === 'left' ? 'left' : 'right'} 
          compact={Boolean(combinedTheme.compact)}
        />
      </ChatWidgetWrapper>
    </Suspense>
  );
};

export default ChatWidget;
