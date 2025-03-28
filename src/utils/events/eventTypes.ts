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
  HISTORY_VIEWED = 'history_viewed',
  ENCRYPTION_ENABLED = 'encryption_enabled',
  KEY_ROTATED = 'key_rotated',
  MESSAGE_ENCRYPTED = 'message_encrypted',
  MESSAGE_DECRYPTED = 'message_decrypted',
  MESSAGE_VALIDATION_FAILED = 'message_validation_failed',
  SUSPICIOUS_CONTENT_DETECTED = 'suspicious_content_detected',
  SESSION_CREATED = 'session_created',
  SESSION_ENDED = 'session_ended',
  SESSION_EXTENDED = 'session_extended',
  SESSION_EXPIRED = 'session_expired',
  CSRF_VALIDATION_FAILED = 'csrf_validation_failed'
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
 * Event for when a key is rotated
 */
export interface KeyRotatedEvent extends ChatEvent {
  type: ChatEventType.KEY_ROTATED;
  conversationId: string;
  keyVersion: number;
}

/**
 * Event for when encryption is enabled for a conversation
 */
export interface EncryptionEnabledEvent extends ChatEvent {
  type: ChatEventType.ENCRYPTION_ENABLED;
  conversationId: string;
}

/**
 * Event for when a message is encrypted
 */
export interface MessageEncryptedEvent extends ChatEvent {
  type: ChatEventType.MESSAGE_ENCRYPTED;
  conversationId: string;
  messageId: string;
  keyVersion: number;
}

/**
 * Event for when a message is decrypted
 */
export interface MessageDecryptedEvent extends ChatEvent {
  type: ChatEventType.MESSAGE_DECRYPTED;
  conversationId: string;
  messageId: string;
  keyVersion: number;
  success: boolean;
}

/**
 * Event for when message validation fails
 */
export interface MessageValidationFailedEvent extends ChatEvent {
  type: ChatEventType.MESSAGE_VALIDATION_FAILED;
  conversationId: string;
  errorCode: string;
  errorMessage: string;
}

/**
 * Event for when suspicious content is detected
 */
export interface SuspiciousContentDetectedEvent extends ChatEvent {
  type: ChatEventType.SUSPICIOUS_CONTENT_DETECTED;
  conversationId: string;
  patternType: string;
}

/**
 * Event for when a session is created
 */
export interface SessionCreatedEvent extends ChatEvent {
  type: ChatEventType.SESSION_CREATED;
  sessionId: string;
}

/**
 * Event for when a session is ended
 */
export interface SessionEndedEvent extends ChatEvent {
  type: ChatEventType.SESSION_ENDED;
  sessionId: string;
}

/**
 * Event for when a session is extended
 */
export interface SessionExtendedEvent extends ChatEvent {
  type: ChatEventType.SESSION_EXTENDED;
  sessionId: string;
}

/**
 * Event for when a session expires
 */
export interface SessionExpiredEvent extends ChatEvent {
  type: ChatEventType.SESSION_EXPIRED;
  sessionId: string;
}

/**
 * Event for when CSRF validation fails
 */
export interface CsrfValidationFailedEvent extends ChatEvent {
  type: ChatEventType.CSRF_VALIDATION_FAILED;
  sessionId: string;
  requestUrl: string;
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
  | KeyRotatedEvent
  | EncryptionEnabledEvent
  | MessageEncryptedEvent
  | MessageDecryptedEvent
  | MessageValidationFailedEvent
  | SuspiciousContentDetectedEvent
  | SessionCreatedEvent
  | SessionEndedEvent
  | SessionExtendedEvent
  | SessionExpiredEvent
  | CsrfValidationFailedEvent
  | ChatEvent; // Base type for other events
