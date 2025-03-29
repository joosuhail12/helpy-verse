
import React, { useState, useEffect } from 'react';
import { ChatWidget } from '../ChatWidget';
import { ThemeConfig, WidgetOptions } from '../types';
import { adaptApiThemeToContextTheme } from '../utils/themeAdapter';

/**
 * Standalone Chat Widget component designed for website embedding via script tag
 * This is the entry point when the widget is loaded via a <script> tag on external websites
 */
const StandaloneChatWidget: React.FC = () => {
  const [options, setOptions] = useState<WidgetOptions | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Mark component as mounted
    setMounted(true);
    
    // Check if configuration exists in window object (set by the script tag)
    if (window.PULLSE_CHAT_CONFIG) {
      setOptions(window.PULLSE_CHAT_CONFIG);
    }
    
    // Listen for initialization events
    const handleInitialize = (e: CustomEvent<{ options: WidgetOptions }>) => {
      setOptions(e.detail.options);
    };
    
    // Add event listener for initialization
    window.addEventListener('chat-widget-initialize', handleInitialize as EventListener);
    
    // Expose global API method for external initialization
    window.PULLSE = {
      ...window.PULLSE,
      initializeWidget: (widgetOptions: WidgetOptions) => {
        setOptions(widgetOptions);
      }
    };
    
    // Cleanup
    return () => {
      window.removeEventListener('chat-widget-initialize', handleInitialize as EventListener);
      setMounted(false);
    };
  }, []);

  if (!mounted) return null;

  // Default workspaceId if not provided
  const workspaceId = options?.workspaceId || '6c22b22f-7bdf-43db-b7c1-9c5884125c63';
  
  // Convert API theme to context theme
  const contextTheme = adaptApiThemeToContextTheme(options?.theme);
  
  return (
    <ChatWidget 
      workspaceId={workspaceId}
      theme={contextTheme}
      settings={options?.settings}
      standalone={true}
    />
  );
};

export default StandaloneChatWidget;

// Add these type declarations to make TypeScript happy with our window object augmentation
declare global {
  interface Window {
    PULLSE?: {
      initializeWidget: (options: WidgetOptions) => void;
      [key: string]: any;
    };
    PULLSE_CHAT_CONFIG?: WidgetOptions;
  }
}
