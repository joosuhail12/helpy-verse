
import React, { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import ConnectedChatWidget from './ConnectedChatWidget';
import { Provider } from 'react-redux';
import { store } from '@/store/store';

/**
 * Standalone chat widget component that can be embedded on any website
 */
const ChatWidgetStandalone: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  
  // Initialize on mount
  useEffect(() => {
    setMounted(true);
    
    // Set default theme
    if (!theme) setTheme('light');
    
    // Cleanup function
    return () => {
      setMounted(false);
    };
  }, []);

  if (!mounted) return null;

  // Wrap in Redux provider to access settings
  return (
    <Provider store={store}>
      <ConnectedChatWidget workspaceId="6c22b22f-7bdf-43db-b7c1-9c5884125c63" />
    </Provider>
  );
};

export default ChatWidgetStandalone;
