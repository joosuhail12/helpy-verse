
import { ChatEventType, ChatEventUnion } from './eventTypes';

// Global event listeners
const listeners: { [key: string]: ((event: any) => void)[] } = {};

/**
 * Emit an event to all registered listeners
 * @param event Event object to emit
 */
export const emitEvent = (event: ChatEventUnion): void => {
  // Log events in development
  if (process.env.NODE_ENV === 'development') {
    console.debug(`[Event Emitted] ${event.type}`, event);
  }
  
  // Notify specific event listeners
  if (listeners[event.type]) {
    listeners[event.type].forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error(`Error in event listener for ${event.type}:`, error);
      }
    });
  }
  
  // Notify wildcard listeners
  if (listeners['*']) {
    listeners['*'].forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in wildcard event listener:', error);
      }
    });
  }
};

/**
 * Listen for specific events
 * @param eventType Event type to listen for, or * for all events
 * @param callback Function to call when event is emitted
 * @returns Unsubscribe function
 */
export const addEventListener = (
  eventType: ChatEventType | '*',
  callback: (event: any) => void
): () => void => {
  if (!listeners[eventType]) {
    listeners[eventType] = [];
  }
  
  listeners[eventType].push(callback);
  
  // Return unsubscribe function
  return () => {
    listeners[eventType] = listeners[eventType].filter(cb => cb !== callback);
    
    // Clean up empty listener arrays
    if (listeners[eventType].length === 0) {
      delete listeners[eventType];
    }
  };
};

/**
 * Create an event of the specified type with source and timestamp automatically added
 * @param type Event type
 * @param data Additional event data
 * @returns Complete event object
 */
export const createEvent = (type: ChatEventType, data: any = {}): ChatEventUnion => {
  return {
    type,
    timestamp: new Date().toISOString(),
    source: data.source || 'event-manager',
    ...data
  };
};

/**
 * Track analytics events by sending to analytics provider
 * @param event Event to track
 */
export const trackEvent = (event: ChatEventUnion): void => {
  // In a real app, you'd send this to your analytics provider
  // For now, we just log it
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] ${event.type}`, event);
  }
  
  // This is where you'd integrate with analytics platforms like
  // Google Analytics, Mixpanel, etc.
};

export default {
  emitEvent,
  addEventListener,
  createEvent,
  trackEvent
};
