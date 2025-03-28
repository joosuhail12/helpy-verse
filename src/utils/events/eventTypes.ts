
export enum ChatEventType {
  // Widget events
  WIDGET_OPENED = 'widget:opened',
  WIDGET_CLOSED = 'widget:closed',
  
  // Message events
  MESSAGE_SENT = 'message:sent',
  MESSAGE_RECEIVED = 'message:received',
  MESSAGE_DELIVERED = 'message:delivered',
  MESSAGE_READ = 'message:read',
  MESSAGE_FAILED = 'message:failed',
  
  // Typing events
  TYPING_STARTED = 'typing:started',
  TYPING_STOPPED = 'typing:stopped',
  
  // Navigation events
  PAGE_NAVIGATION = 'navigation:page',
  
  // Error events
  ERROR_OCCURRED = 'error:occurred',
  
  // Rate limiting events
  RATE_LIMIT_TRIGGERED = 'rateLimit:triggered',
  RATE_LIMIT_CLEARED = 'rateLimit:cleared',
  
  // Contact events
  CONTACT_IDENTIFIED = 'contact:identified',
  
  // Agent events
  AGENT_JOINED = 'agent:joined',
  AGENT_LEFT = 'agent:left',
  
  // Session events
  SESSION_STARTED = 'session:started',
  SESSION_ENDED = 'session:ended'
}

export type ChatEventUnion = {
  type: ChatEventType;
  timestamp: string;
  source: string;
  [key: string]: any;
};
