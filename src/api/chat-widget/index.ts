
/**
 * Public API for the Chat Widget
 * This is the main entry point for applications to interact with the chat widget
 */
import type { ChatWidgetConfig, ChatMessage, FileAttachment } from './types';
import { initializeChatWidget } from './initialize';
import { sendMessage, getMessages } from './messages';
import { updateWidgetTheme, getWidgetTheme } from './appearance';
import { openWidget, closeWidget, toggleWidget, isWidgetOpen } from './controls';
import { addAttachment, removeAttachment, getAttachments } from './attachments';

// Export the public API
export {
  // Core initialization
  initializeChatWidget,
  
  // Message handling
  sendMessage,
  getMessages,
  
  // Widget appearance
  updateWidgetTheme,
  getWidgetTheme,
  
  // Widget controls
  openWidget,
  closeWidget,
  toggleWidget,
  isWidgetOpen,
  
  // Attachments
  addAttachment,
  removeAttachment,
  getAttachments,
  
  // Types
  ChatWidgetConfig,
  ChatMessage,
  FileAttachment
};

// Also provide a direct default export for single import
export default {
  initialize: initializeChatWidget,
  message: {
    send: sendMessage,
    getAll: getMessages
  },
  theme: {
    update: updateWidgetTheme,
    get: getWidgetTheme
  },
  widget: {
    open: openWidget,
    close: closeWidget,
    toggle: toggleWidget,
    isOpen: isWidgetOpen
  },
  attachments: {
    add: addAttachment,
    remove: removeAttachment,
    getAll: getAttachments
  }
};
