
/**
 * Public API for the Chat Widget
 * This module serves as the boundary between the widget implementations
 * and external applications.
 */
import type { ChatMessage, ThemeConfig, WidgetOptions } from '../types';

// Core widget actions
export const openWidget = (): void => {
  window.dispatchEvent(new CustomEvent('chat-widget-open'));
};

export const closeWidget = (): void => {
  window.dispatchEvent(new CustomEvent('chat-widget-close'));
};

export const toggleWidget = (): void => {
  window.dispatchEvent(new CustomEvent('chat-widget-toggle'));
};

export const isWidgetOpen = (): boolean => {
  // This could be enhanced to check actual widget state
  return document.querySelector('.chat-widget-container[data-open="true"]') !== null;
};

// Message handling
export const sendMessage = async (message: string): Promise<ChatMessage | undefined> => {
  try {
    // In a real implementation, this would send to an API
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date().toISOString(),
      conversationId: 'current'
    };
    
    // Dispatch an event that components can listen for
    window.dispatchEvent(new CustomEvent('chat-message-sent', { 
      detail: { message: newMessage } 
    }));
    
    return newMessage;
  } catch (error) {
    console.error('Failed to send message:', error);
    return undefined;
  }
};

export const getMessages = async (): Promise<ChatMessage[]> => {
  // In a real implementation, this would fetch from an API
  return [];
};

// Theme customization
export const updateTheme = (theme: Partial<ThemeConfig>): void => {
  window.dispatchEvent(new CustomEvent('chat-widget-theme-update', { 
    detail: { theme } 
  }));
};

// Initialization
export const initialize = (options: WidgetOptions): void => {
  window.dispatchEvent(new CustomEvent('chat-widget-initialize', { 
    detail: { options } 
  }));
};

// Type exports
export type { 
  ChatMessage, 
  ThemeConfig, 
  WidgetOptions 
} from '../types';

// Default export for convenience
export default {
  initialize,
  openWidget,
  closeWidget,
  toggleWidget,
  isWidgetOpen,
  sendMessage,
  getMessages,
  updateTheme
};
