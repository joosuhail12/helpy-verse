
import React, { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import IsolatedChatWidget from './IsolatedChatWidget';
import { ChatWidgetProvider } from '@/context/ChatWidgetContext';
import { adaptApiThemeToContextTheme } from '@/utils/themeAdapter';

/**
 * Standalone chat widget component that can be embedded on any website
 */
const ChatWidgetStandalone: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [config, setConfig] = useState<any>(null);
  const { theme, setTheme } = useTheme();
  
  // Initialize widget with config from window
  useEffect(() => {
    setMounted(true);
    
    // Set default theme
    if (!theme) setTheme('light');
    
    // Expose initialization method
    window.PULLSE = {
      ...window.PULLSE,
      initializeWidget: (widgetConfig: any) => {
        setConfig(widgetConfig);
      }
    };
    
    // Check if there's already a config in the window
    if (window.PULLSE_CHAT_CONFIG) {
      setConfig(window.PULLSE_CHAT_CONFIG);
    }
    
    // Cleanup function
    return () => {
      setMounted(false);
    };
  }, []);

  if (!mounted) return null;

  const workspaceId = config?.workspaceId || '6c22b22f-7bdf-43db-b7c1-9c5884125c63';

  // Use isolated context-based widget
  return (
    <ChatWidgetProvider>
      <IsolatedChatWidget 
        workspaceId={workspaceId} 
        config={config}
      />
    </ChatWidgetProvider>
  );
};

export default ChatWidgetStandalone;
