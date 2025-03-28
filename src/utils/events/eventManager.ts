
import { ChatEvent, ChatEventType, ChatEventUnion } from './eventTypes';

type EventCallback = (event: ChatEventUnion) => void;

/**
 * Manages events for the chat widget system
 */
class EventManager {
  private listeners: Map<ChatEventType, Set<EventCallback>> = new Map();
  private globalListeners: Set<EventCallback> = new Set();
  private sessionId: string;
  private pageUrl: string;
  
  constructor() {
    this.sessionId = this.generateSessionId();
    this.pageUrl = this.getCurrentPageUrl();
    
    // Track page navigation
    if (typeof window !== 'undefined') {
      this.setupPageNavigationTracking();
    }
  }
  
  /**
   * Subscribe to a specific event type
   */
  public subscribe(eventType: ChatEventType, callback: EventCallback): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    
    this.listeners.get(eventType)?.add(callback);
    
    // Return an unsubscribe function
    return () => {
      this.listeners.get(eventType)?.delete(callback);
    };
  }
  
  /**
   * Subscribe to all events
   */
  public subscribeToAll(callback: EventCallback): () => void {
    this.globalListeners.add(callback);
    
    // Return an unsubscribe function
    return () => {
      this.globalListeners.delete(callback);
    };
  }
  
  /**
   * Publish an event to all subscribers
   */
  public publish(event: ChatEventUnion): void {
    // Ensure timestamp and add context data
    const enrichedEvent = this.enrichEvent(event);
    
    // Notify specific event listeners
    this.listeners.get(event.type)?.forEach(callback => {
      try {
        callback(enrichedEvent);
      } catch (error) {
        console.error(`Error in event listener for ${event.type}:`, error);
      }
    });
    
    // Notify global listeners
    this.globalListeners.forEach(callback => {
      try {
        callback(enrichedEvent);
      } catch (error) {
        console.error(`Error in global event listener:`, error);
      }
    });
    
    // Log events in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Event] ${event.type}:`, enrichedEvent);
    }
  }
  
  /**
   * Add metadata and ensure required fields are present
   */
  private enrichEvent(event: ChatEventUnion): ChatEventUnion {
    return {
      ...event,
      timestamp: event.timestamp || new Date().toISOString(),
      source: event.source || 'chat-widget',
      sessionId: event.sessionId || this.sessionId,
      pageUrl: event.pageUrl || this.pageUrl
    };
  }
  
  /**
   * Generate a unique session ID
   */
  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
  
  /**
   * Get the current page URL
   */
  private getCurrentPageUrl(): string {
    return typeof window !== 'undefined' ? window.location.href : '';
  }
  
  /**
   * Setup tracking for page navigation events
   */
  private setupPageNavigationTracking(): void {
    let currentUrl = window.location.href;
    
    // Use history API to track URL changes
    const handleUrlChange = () => {
      const newUrl = window.location.href;
      if (newUrl !== currentUrl) {
        this.publish({
          type: ChatEventType.PAGE_NAVIGATION,
          timestamp: new Date().toISOString(),
          source: 'navigation',
          previousUrl: currentUrl,
          currentUrl: newUrl,
          pageUrl: newUrl
        });
        
        currentUrl = newUrl;
        this.pageUrl = newUrl;
      }
    };
    
    // Track history changes
    window.addEventListener('popstate', handleUrlChange);
    
    // Patch history methods to detect programmatic navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(...args) {
      originalPushState.apply(this, args);
      handleUrlChange();
    };
    
    history.replaceState = function(...args) {
      originalReplaceState.apply(this, args);
      handleUrlChange();
    };
  }
  
  /**
   * Reset the event manager (mainly for testing)
   */
  public reset(): void {
    this.listeners.clear();
    this.globalListeners.clear();
    this.sessionId = this.generateSessionId();
  }
}

// Create a singleton instance
export const eventManager = new EventManager();

// Create a hooks-friendly event emitter
export const emitEvent = (event: ChatEventUnion): void => {
  eventManager.publish(event);
};
