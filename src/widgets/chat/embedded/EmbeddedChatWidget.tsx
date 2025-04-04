
import React, { useState, useEffect } from 'react';
import { ChatWidget } from '../ChatWidget';
import { ThemeConfig, ChatWidgetSettings } from '../types';
import { adaptApiThemeToContextTheme } from '../utils/themeAdapter';
import { WidgetStateProvider } from '../context/WidgetStateContext';
import { v4 as uuidv4 } from 'uuid';

interface EmbeddedChatWidgetProps {
  /**
   * Unique workspace identifier
   */
  workspaceId: string;
  
  /**
   * Theme configuration for customizing appearance
   */
  theme?: Partial<ThemeConfig>;
  
  /**
   * Additional settings for the widget
   */
  settings?: Partial<ChatWidgetSettings>;
  
  /**
   * Optional callback when the widget is opened
   */
  onOpen?: () => void;
  
  /**
   * Optional callback when the widget is closed
   */
  onClose?: () => void;
  
  /**
   * Optional callback when a message is sent
   */
  onMessageSent?: (message: string) => void;
}

/**
 * Embedded Chat Widget component designed for use within React applications
 * This is the entry point when the widget is imported and used in a React app
 */
const EmbeddedChatWidget: React.FC<EmbeddedChatWidgetProps> = ({
  workspaceId,
  theme,
  settings,
  onOpen,
  onClose,
  onMessageSent
}) => {
  // Generate a unique ID for this widget instance to ensure state isolation
  const [instanceId] = useState(() => `widget-${uuidv4()}`);
  
  // Set up event listeners for callbacks if provided
  React.useEffect(() => {
    // Create namespaced event names to prevent cross-widget interference
    const openEventName = `chat-widget-open-${instanceId}`;
    const closeEventName = `chat-widget-close-${instanceId}`;
    const messageSentEventName = `chat-message-sent-${instanceId}`;
    
    const handleOpen = () => {
      if (onOpen) onOpen();
    };
    
    const handleClose = () => {
      if (onClose) onClose();
    };
    
    const handleMessageSent = (e: CustomEvent<{ message: { content: string } }>) => {
      if (onMessageSent) onMessageSent(e.detail.message.content);
    };
    
    // Add event listeners
    window.addEventListener(openEventName, handleOpen);
    window.addEventListener(closeEventName, handleClose);
    window.addEventListener(messageSentEventName, handleMessageSent as EventListener);
    
    // Clean up event listeners
    return () => {
      window.removeEventListener(openEventName, handleOpen);
      window.removeEventListener(closeEventName, handleClose);
      window.removeEventListener(messageSentEventName, handleMessageSent as EventListener);
    };
  }, [instanceId, onOpen, onClose, onMessageSent]);

  // Convert API theme to context theme
  const contextTheme = adaptApiThemeToContextTheme(theme);

  return (
    <WidgetStateProvider>
      <ChatWidget 
        workspaceId={workspaceId}
        theme={contextTheme}
        settings={settings}
        standalone={false}
        instanceId={instanceId}
      />
    </WidgetStateProvider>
  );
};

export default EmbeddedChatWidget;
