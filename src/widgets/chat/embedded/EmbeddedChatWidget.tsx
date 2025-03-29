
import React from 'react';
import { ChatWidget } from '../ChatWidget';
import { ThemeConfig, ChatWidgetSettings } from '../types';

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
  // Set up event listeners for callbacks if provided
  React.useEffect(() => {
    if (onOpen) {
      window.addEventListener('chat-widget-open', onOpen);
    }
    
    if (onClose) {
      window.addEventListener('chat-widget-close', onClose);
    }
    
    if (onMessageSent) {
      const handleMessageSent = (e: CustomEvent<{ message: { content: string } }>) => {
        onMessageSent(e.detail.message.content);
      };
      
      window.addEventListener('chat-message-sent', handleMessageSent as EventListener);
      
      return () => {
        window.removeEventListener('chat-message-sent', handleMessageSent as EventListener);
        if (onOpen) window.removeEventListener('chat-widget-open', onOpen);
        if (onClose) window.removeEventListener('chat-widget-close', onClose);
      };
    }
    
    return () => {
      if (onOpen) window.removeEventListener('chat-widget-open', onOpen);
      if (onClose) window.removeEventListener('chat-widget-close', onClose);
    };
  }, [onOpen, onClose, onMessageSent]);

  return (
    <ChatWidget 
      workspaceId={workspaceId}
      theme={theme}
      settings={settings}
      standalone={false}
    />
  );
};

export default EmbeddedChatWidget;
