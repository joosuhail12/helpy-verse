
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
  const [instanceId] = useState(() => `widget-${uuidv4().slice(0, 8)}`);
  
  // Set up event listeners for callbacks if provided
  React.useEffect(() => {
    // Create namespaced event names to prevent cross-widget interference
    const openEventName = `chat-widget-open-${instanceId}`;
    const closeEventName = `chat-widget-close-${instanceId}`;
    const messageSentEventName = `chat-message-sent-${instanceId}`;
    const toggleEventName = `chat-widget-toggle-${instanceId}`;
    
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
    window.addEventListener(toggleEventName, () => {
      // Toggle event needs to check current state to determine which callback to fire
      const widgetState = localStorage.getItem(`chat-widget-state-${instanceId}`);
      if (widgetState) {
        const { isOpen } = JSON.parse(widgetState);
        if (isOpen && onClose) onClose();
        if (!isOpen && onOpen) onOpen();
      }
    });
    
    // Clean up event listeners
    return () => {
      window.removeEventListener(openEventName, handleOpen);
      window.removeEventListener(closeEventName, handleClose);
      window.removeEventListener(messageSentEventName, handleMessageSent as EventListener);
      window.removeEventListener(toggleEventName, handleOpen);
    };
  }, [instanceId, onOpen, onClose, onMessageSent]);

  // Convert API theme to context theme and force right positioning
  const contextTheme = {
    ...adaptApiThemeToContextTheme(theme),
    position: 'right' // Always force right positioning
  };

  // Expose imperative methods for parent components
  React.useEffect(() => {
    // Create a method to programmatically trigger widget actions
    if (window && !window.PULLSE) {
      window.PULLSE = {};
    }
    
    if (window.PULLSE) {
      window.PULLSE[`widget_${instanceId}`] = {
        open: () => {
          window.dispatchEvent(new CustomEvent(`chat-widget-open-${instanceId}`));
        },
        close: () => {
          window.dispatchEvent(new CustomEvent(`chat-widget-close-${instanceId}`));
        },
        toggle: () => {
          window.dispatchEvent(new CustomEvent(`chat-widget-toggle-${instanceId}`));
        }
      };
    }
    
    return () => {
      if (window.PULLSE) {
        delete window.PULLSE[`widget_${instanceId}`];
      }
    };
  }, [instanceId]);

  return (
    <WidgetStateProvider instanceId={instanceId}>
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
