
/**
 * Application Constants
 */

// Local storage keys
export const localStorageKeys = {
  // User related
  USER_ID: 'chat-widget-user-id',
  USER_NAME: 'chat-widget-user-name',
  USER_EMAIL: 'chat-widget-user-email',
  
  // Chat widget state
  WIDGET_STATE: 'chat-widget-state',
  WIDGET_MINIMIZED: 'chat-widget-minimized',
  WIDGET_CURRENT_PAGE: 'chat-widget-current-page',
  
  // Conversation related
  CURRENT_CONVERSATION_ID: 'chat-widget-conversation-id',
  QUEUED_MESSAGES: 'chat-widget-queued-messages',
  
  // Theme related
  THEME_PREFERENCES: 'chat-widget-theme'
};

// API endpoints
export const apiEndpoints = {
  CONVERSATIONS: '/api/conversations',
  MESSAGES: '/api/messages',
  USERS: '/api/users'
};

// Chat widget default settings
export const chatWidgetDefaults = {
  RESPONSE_TIME: '5 minutes',
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_ATTACHMENTS: 5,
  MAX_MESSAGE_LENGTH: 2000
};

// Default theme
export const defaultTheme = {
  primaryColor: '#0066ff',
  secondaryColor: '#e5f0ff',
  textColor: '#111827',
  backgroundColor: '#ffffff'
};
