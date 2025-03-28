
import { ChatEventType, ChatEventUnion } from './eventTypes';

// Queue of events for when system is offline
let offlineEventQueue: ChatEventUnion[] = [];

// Event listeners
type EventListener = (event: ChatEventUnion) => void;
const listeners: Record<string, EventListener[]> = {};
const allEventListeners: EventListener[] = [];

// Emit event to all listeners
export function emitEvent(event: ChatEventUnion): void {
  if (!navigator.onLine) {
    // Queue event for when we're back online
    offlineEventQueue.push(event);
    return;
  }
  
  // Process event through listeners
  processEvent(event);
  
  // Log event in development environment
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Event] ${event.type}:`, event);
  }
}

// Process an event through registered listeners
function processEvent(event: ChatEventUnion): void {
  // Call type-specific listeners
  if (listeners[event.type]) {
    listeners[event.type].forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in event listener:', error);
      }
    });
  }
  
  // Call global listeners that receive all events
  allEventListeners.forEach(listener => {
    try {
      listener(event);
    } catch (error) {
      console.error('Error in global event listener:', error);
    }
  });
}

// Subscribe to specific event type
export function subscribeToEvent(
  eventType: ChatEventType,
  callback: EventListener
): () => void {
  if (!listeners[eventType]) {
    listeners[eventType] = [];
  }
  
  listeners[eventType].push(callback);
  
  // Return unsubscribe function
  return () => {
    listeners[eventType] = listeners[eventType].filter(listener => listener !== callback);
  };
}

// Subscribe to all events
export function subscribeToAllEvents(callback: EventListener): () => void {
  allEventListeners.push(callback);
  
  // Return unsubscribe function
  return () => {
    const index = allEventListeners.indexOf(callback);
    if (index !== -1) {
      allEventListeners.splice(index, 1);
    }
  };
}

// Process offline event queue when back online
window.addEventListener('online', () => {
  if (offlineEventQueue.length > 0) {
    // Process queued events
    const events = [...offlineEventQueue];
    offlineEventQueue = [];
    
    events.forEach(event => {
      emitEvent({
        ...event,
        retriedAt: new Date().toISOString()
      });
    });
  }
});
