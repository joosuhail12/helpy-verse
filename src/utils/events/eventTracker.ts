
import { ChatEventType, ChatEventUnion } from './eventTypes';
import eventManager from './eventManager';

/**
 * Event tracking implementation
 */
class EventTracker {
  /**
   * Track an event
   */
  trackEvent(event: ChatEventUnion): void {
    // Log the event
    if (process.env.NODE_ENV === 'development') {
      console.log(`[EventTracker] ${event.type}`, event);
    }
    
    // Send the event to the event manager
    eventManager.emitEvent(event);
    
    // Here we could also send the event to analytics services
    // like Google Analytics, Mixpanel, etc.
  }
  
  /**
   * Track an event by type and data
   */
  track(type: ChatEventType, data: any = {}): void {
    const event: ChatEventUnion = {
      type,
      timestamp: new Date().toISOString(),
      source: data.source || 'event-tracker',
      ...data
    };
    
    this.trackEvent(event);
  }
  
  /**
   * Subscribe to all events
   */
  subscribeToAll(callback: (event: ChatEventUnion) => void): () => void {
    return eventManager.addEventListener('*', callback);
  }
  
  /**
   * Subscribe to a specific event type
   */
  subscribe(eventType: ChatEventType, callback: (event: ChatEventUnion) => void): () => void {
    return eventManager.addEventListener(eventType, callback);
  }
}

export const eventTracker = new EventTracker();
export default eventTracker;
