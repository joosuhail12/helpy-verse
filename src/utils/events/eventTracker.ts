import { eventManager } from './eventManager';
import { ChatEventType, ChatEventUnion } from './eventTypes';

/**
 * Configuration for the event tracker
 */
interface EventTrackerConfig {
  enableConsoleLogging?: boolean;
  enableLocalStorage?: boolean;
  maxStoredEvents?: number;
  analyticsEndpoint?: string;
}

const DEFAULT_CONFIG: EventTrackerConfig = {
  enableConsoleLogging: false,
  enableLocalStorage: true,
  maxStoredEvents: 100,
  analyticsEndpoint: undefined
};

/**
 * Event tracking utility for analytics and debugging
 */
export class EventTracker {
  private config: EventTrackerConfig;
  private storageKey = 'pullse-chat-events';
  
  constructor(config: EventTrackerConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.initialize();
  }
  
  /**
   * Initialize the event tracker
   */
  private initialize(): void {
    // Subscribe to all events
    eventManager.subscribeToAll(event => this.processEvent(event));
  }
  
  /**
   * Process an incoming event
   */
  private processEvent(event: ChatEventUnion): void {
    // Console logging if enabled
    if (this.config.enableConsoleLogging) {
      console.log(`[EventTracker] ${event.type}:`, event);
    }
    
    // Store in local storage if enabled
    if (this.config.enableLocalStorage) {
      this.storeEvent(event);
    }
    
    // Send to analytics endpoint if configured
    if (this.config.analyticsEndpoint) {
      this.sendToAnalytics(event);
    }
  }
  
  /**
   * Store event in local storage
   */
  private storeEvent(event: ChatEventUnion): void {
    try {
      const storedEvents = this.getStoredEvents();
      storedEvents.push(event);
      
      // Keep only the most recent events (limit by maxStoredEvents)
      while (storedEvents.length > (this.config.maxStoredEvents || 100)) {
        storedEvents.shift();
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(storedEvents));
    } catch (error) {
      console.error('Failed to store event in localStorage:', error);
    }
  }
  
  /**
   * Get events from local storage
   */
  private getStoredEvents(): ChatEventUnion[] {
    try {
      const eventsJson = localStorage.getItem(this.storageKey);
      return eventsJson ? JSON.parse(eventsJson) : [];
    } catch (error) {
      console.error('Failed to retrieve events from localStorage:', error);
      return [];
    }
  }
  
  /**
   * Send event to analytics endpoint
   */
  private sendToAnalytics(event: ChatEventUnion): void {
    if (!this.config.analyticsEndpoint) return;
    
    fetch(this.config.analyticsEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event),
      keepalive: true // Ensure data is sent even if page is unloading
    }).catch(error => {
      console.error('Failed to send event to analytics:', error);
    });
  }
  
  /**
   * Get all stored events (for debugging/analysis)
   */
  public getAllEvents(): ChatEventUnion[] {
    return this.getStoredEvents();
  }
  
  /**
   * Get events of a specific type
   */
  public getEventsByType(eventType: ChatEventType): ChatEventUnion[] {
    return this.getStoredEvents().filter(event => event.type === eventType);
  }
  
  /**
   * Clear all stored events
   */
  public clearEvents(): void {
    localStorage.removeItem(this.storageKey);
  }
  
  /**
   * Get session metrics
   */
  public getSessionMetrics(): Record<string, any> {
    const events = this.getStoredEvents();
    const metrics: Record<string, any> = {
      totalEvents: events.length,
      eventCounts: {} as Record<string, number>,
      averageMessageLength: 0,
      sessionsStarted: 0,
      totalTimeSpent: 0
    };
    
    // Count events by type
    events.forEach(event => {
      const type = event.type;
      metrics.eventCounts[type] = (metrics.eventCounts[type] || 0) + 1;
    });
    
    // Calculate message metrics
    const messageEvents = events.filter(e => 
      e.type === ChatEventType.MESSAGE_SENT
    ) as any[];
    
    if (messageEvents.length > 0) {
      const totalLength = messageEvents.reduce((sum, e) => 
        sum + (e.content?.length || 0), 0);
      metrics.averageMessageLength = totalLength / messageEvents.length;
    }
    
    // Calculate sessions and time spent
    const openEvents = events.filter(e => 
      e.type === ChatEventType.WIDGET_OPENED
    );
    const closeEvents = events.filter(e => 
      e.type === ChatEventType.WIDGET_CLOSED
    ) as any[];
    
    metrics.sessionsStarted = openEvents.length;
    metrics.totalTimeSpent = closeEvents.reduce((sum, e) => 
      sum + (e.timeOpen || 0), 0);
    
    return metrics;
  }
}

// Create a default instance
export const eventTracker = new EventTracker({
  enableConsoleLogging: process.env.NODE_ENV === 'development'
});
