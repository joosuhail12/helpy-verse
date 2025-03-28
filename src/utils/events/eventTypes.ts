
/**
 * Event types for the chat widget
 */
export enum ChatEventType {
  WIDGET_OPENED = 'widget_opened',
  WIDGET_CLOSED = 'widget_closed',
  MESSAGE_SENT = 'message_sent',
  MESSAGE_RECEIVED = 'message_received',
  CONVERSATION_STARTED = 'conversation_started',
  CONVERSATION_ENDED = 'conversation_ended',
  USER_IDENTIFIED = 'user_identified',
  ERROR_OCCURRED = 'error_occurred',
  PAGE_NAVIGATION = 'page_navigation',
  BUTTON_CLICKED = 'button_clicked',
  TYPING_STARTED = 'typing_started',
  TYPING_ENDED = 'typing_ended',
  FILE_UPLOADED = 'file_uploaded',
  THEME_CHANGED = 'theme_changed',
  CONTACT_LOADED = 'contact_loaded',
  HISTORY_VIEWED = 'history_viewed'
}

/**
 * Base interface for all chat events
 */
export interface ChatEvent {
  type: ChatEventType;
  timestamp: string;
  source: string;
  pageUrl?: string;
  sessionId?: string;
  conversationId?: string;
  metadata?: Record<string, any>;
}

/**
 * Event for when the widget is opened
 */
export interface WidgetOpenedEvent extends ChatEvent {
  type: ChatEventType.WIDGET_OPENED;
  trigger: 'user' | 'auto' | 'api';
}

/**
 * Event for when the widget is closed
 */
export interface WidgetClosedEvent extends ChatEvent {
  type: ChatEventType.WIDGET_CLOSED;
  timeOpen: number; // milliseconds
}

/**
 * Event for when a message is sent by the user
 */
export interface MessageSentEvent extends ChatEvent {
  type: ChatEventType.MESSAGE_SENT;
  messageId: string;
  content: string;
  attachments?: number;
}

/**
 * Event for when a message is received from the agent
 */
export interface MessageReceivedEvent extends ChatEvent {
  type: ChatEventType.MESSAGE_RECEIVED;
  messageId: string;
  content: string;
  agentId?: string;
}

/**
 * Event for when a user navigates to a different page with the widget open
 */
export interface PageNavigationEvent extends ChatEvent {
  type: ChatEventType.PAGE_NAVIGATION;
  previousUrl: string;
  currentUrl: string;
}

/**
 * Event for when a user is identified
 */
export interface UserIdentifiedEvent extends ChatEvent {
  type: ChatEventType.USER_IDENTIFIED;
  contactId: string;
  metadata?: {
    email?: string;
    name?: string;
  };
}

/**
 * Event for when contact information is loaded
 */
export interface ContactLoadedEvent extends ChatEvent {
  type: ChatEventType.CONTACT_LOADED;
  contactId: string;
  success: boolean;
}

/**
 * Event for when conversation history is viewed
 */
export interface HistoryViewedEvent extends ChatEvent {
  type: ChatEventType.HISTORY_VIEWED;
  contactId: string;
}

/**
 * Union type of all possible chat events
 */
export type ChatEventUnion = 
  | WidgetOpenedEvent
  | WidgetClosedEvent
  | MessageSentEvent
  | MessageReceivedEvent
  | PageNavigationEvent
  | UserIdentifiedEvent
  | ContactLoadedEvent
  | HistoryViewedEvent
  | ChatEvent; // Base type for other events
