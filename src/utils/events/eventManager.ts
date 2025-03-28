
import { ChatEventType, ChatEventUnion } from './eventTypes';

/**
 * Event Manager for handling custom events throughout the application
 */
class EventManager {
  // Map of event types to sets of callback functions
  private eventListeners: Map<string, Set<(event: any) => void>> = new Map();
  
  // Listeners for all events
  private globalListeners: Set<(event: any) => void> = new Set();
  
  /**
   * Subscribe to a specific event type
   */
  subscribe(eventType: ChatEventType, callback: (event: ChatEventUnion) => void): () => void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, new Set());
    }
    
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      listeners.add(callback);
    }
    
    // Return unsubscribe function
    return () => {
      const listenersSet = this.eventListeners.get(eventType);
      if (listenersSet) {
        listenersSet.delete(callback);
      }
    };
  }
  
  /**
   * Subscribe to all events
   */
  subscribeToAll(callback: (event: ChatEventUnion) => void): () => void {
    this.globalListeners.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.globalListeners.delete(callback);
    };
  }
  
  /**
   * Publish an event
   */
  publish(event: ChatEventUnion): void {
    // Add timestamp if not present
    if (!event.timestamp) {
      event.timestamp = new Date().toISOString();
    }
    
    // Call specific event listeners
    const listeners = this.eventListeners.get(event.type);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(event);
        } catch (error) {
          console.error(`Error in event listener for ${event.type}:`, error);
        }
      });
    }
    
    // Call global listeners
    this.globalListeners.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error(`Error in global event listener:`, error);
      }
    });
    
    // Log events in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Event] ${event.type}:`, event);
    }
  }
  
  /**
   * React hook-like API for components to use events
   */
  useEvent<T extends ChatEventUnion>(
    eventType: ChatEventType, 
    callback: (event: T) => void,
    deps: any[] = []
  ): void {
    // Note: This is a simplified version. In a real implementation, 
    // you would need to use React's useEffect and possibly useCallback
    this.subscribe(eventType, callback as (event: ChatEventUnion) => void);
  }
  
  /**
   * Clear all event listeners
   */
  clearListeners(): void {
    this.eventListeners.clear();
    this.globalListeners.clear();
  }
}

// Export a singleton instance
export const eventManager = new EventManager();

// Export a convenience function for emitting events
export const emitEvent = (event: ChatEventUnion): void => {
  eventManager.publish(event);
};

export default eventManager;
