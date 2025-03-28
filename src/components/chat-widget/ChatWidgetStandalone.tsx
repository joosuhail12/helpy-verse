
import React, { useEffect, useState } from 'react';
import { ChatWidget } from './ChatWidget';
import { ChatProvider } from '@/context/ChatContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { sessionManager } from '@/utils/auth/sessionManager';
import { registerServiceWorker } from '@/utils/serviceWorker';
import { preloadAssets, chatWidgetCriticalAssets, setupLazyLoading } from '@/utils/resourcePreloader';
import EventDebugger from './components/events/EventDebugger';
import { eventTracker } from '@/utils/events/eventTracker';
import { emitEvent } from '@/utils/events/eventManager';
import { ChatEventType } from '@/utils/events/eventTypes';
import { useContactManagement } from '@/hooks/chat/useContactManagement';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import ContactContextPanel from './components/contact-context/ContactContextPanel';

// Get configuration from window object or use defaults
const config = (window as any).PULLSE_CHAT_CONFIG || {
  workspaceId: '6c22b22f-7bdf-43db-b7c1-9c5884125c63',
  theme: {
    colors: {},
    position: 'right',
    compact: false,
    labels: {},
    features: {
      typingIndicator: true,
      reactions: true,
      fileAttachments: true,
      readReceipts: true,
      contactContext: true // New feature flag
    },
    // Security settings
    security: {
      requireAuthentication: false,
      endToEndEncryption: false,
      sessionTimeout: 30 // minutes
    }
  }
};

// Get workspace ID and security settings from configuration
const { workspaceId } = config;
const securitySettings = config.theme?.security || {};
const features = config.theme?.features || {};

// Initialize session with timeout from config
const sessionTimeoutMs = (securitySettings.sessionTimeout || 30) * 60 * 1000;

const ChatWidgetStandalone: React.FC = () => {
  const [showDebugger, setShowDebugger] = useState(process.env.NODE_ENV === 'development');
  const [showContactContext, setShowContactContext] = useState(features.contactContext || false);
  const { contactId } = useContactManagement(workspaceId);
  
  // Initialize service worker, session, and optimize resources on load
  useEffect(() => {
    // Register service worker
    registerServiceWorker().catch(err => {
      console.warn('Service worker registration failed:', err);
    });
    
    // Preload critical assets
    preloadAssets(chatWidgetCriticalAssets).catch(err => {
      console.warn('Asset preloading failed:', err);
    });
    
    // Setup lazy loading for images
    setupLazyLoading();
    
    // Initialize session
    sessionManager.initSession(sessionTimeoutMs);
    
    // Set up interval to check session status
    const checkSessionInterval = setInterval(() => {
      if (!sessionManager.isSessionActive()) {
        console.log('Chat session expired');
        // Refresh session to start over
        sessionManager.initSession(sessionTimeoutMs);
      } else {
        sessionManager.updateActivity();
      }
    }, 60000); // Check every minute
    
    // Emit page load event with current URL
    emitEvent({
      type: ChatEventType.PAGE_NAVIGATION,
      timestamp: new Date().toISOString(),
      source: 'page-load',
      previousUrl: '',
      currentUrl: window.location.href,
      pageUrl: window.location.href
    });
    
    return () => {
      clearInterval(checkSessionInterval);
    };
  }, []);

  const toggleDebugger = () => {
    setShowDebugger(prev => !prev);
  };

  const toggleContactContext = () => {
    setShowContactContext(prev => !prev);
  };
  
  return (
    <ThemeProvider initialTheme={config.theme}>
      <ChatProvider 
        workspaceId={workspaceId} 
        requiresAuthentication={securitySettings.requireAuthentication}
      >
        {showContactContext ? (
          <ResizablePanelGroup direction="horizontal" className="w-full h-full">
            <ResizablePanel defaultSize={70} minSize={50}>
              <ChatWidget 
                workspaceId={workspaceId}
                theme={{
                  position: config.theme?.position,
                  compact: config.theme?.compact,
                  colors: config.theme?.colors
                }}
              />
            </ResizablePanel>
            
            <ResizableHandle />
            
            <ResizablePanel defaultSize={30} minSize={20}>
              <ContactContextPanel contactId={contactId} />
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <ChatWidget 
            workspaceId={workspaceId}
            theme={{
              position: config.theme?.position,
              compact: config.theme?.compact,
              colors: config.theme?.colors
            }}
          />
        )}
        
        {process.env.NODE_ENV === 'development' && (
          <>
            <EventDebugger 
              isVisible={showDebugger} 
              onClose={() => setShowDebugger(false)} 
            />
            
            <div className="fixed bottom-4 left-4 z-40 flex gap-2">
              <button 
                onClick={toggleDebugger}
                className="bg-gray-800 text-white text-xs px-2 py-1 rounded"
              >
                {showDebugger ? 'Hide' : 'Show'} Event Debugger
              </button>
              
              <button 
                onClick={toggleContactContext}
                className="bg-blue-600 text-white text-xs px-2 py-1 rounded"
              >
                {showContactContext ? 'Hide' : 'Show'} Contact Panel
              </button>
            </div>
          </>
        )}
      </ChatProvider>
    </ThemeProvider>
  );
};

export default ChatWidgetStandalone;
