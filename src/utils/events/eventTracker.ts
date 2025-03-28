
import eventManager from './eventManager';
import { ChatEventType, ChatEventUnion } from './eventTypes';

/**
 * Utility for tracking and analyzing events in the application
 */
class EventTracker {
  private events: ChatEventUnion[] = [];
  private maxEvents = 1000; // Maximum number of events to keep in memory
  
  constructor() {
    // Subscribe to all events
    eventManager.subscribeToAll(this.trackEvent);
  }
  
  /**
   * Track an event
   */
  trackEvent = (event: ChatEventUnion): void => {
    // Add event to history
    this.events.push(event);
    
    // Trim event history if it gets too long
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(this.events.length - this.maxEvents);
    }
  };
  
  /**
   * Get events of a specific type
   */
  getEventsByType(eventType: ChatEventType): ChatEventUnion[] {
    return this.events.filter(event => event.type === eventType);
  }
  
  /**
   * Get all tracked events
   */
  getAllEvents(): ChatEventUnion[] {
    return [...this.events];
  }
  
  /**
   * Get events in a specific time range
   */
  getEventsByTimeRange(startTime: Date, endTime: Date): ChatEventUnion[] {
    return this.events.filter(event => {
      const eventTime = new Date(event.timestamp);
      return eventTime >= startTime && eventTime <= endTime;
    });
  }
  
  /**
   * Get events from a specific source
   */
  getEventsBySource(source: string): ChatEventUnion[] {
    return this.events.filter(event => event.source === source);
  }
  
  /**
   * Clear tracked events
   */
  clearEvents(): void {
    this.events = [];
  }
  
  /**
   * Get events count by type
   */
  getEventCountByType(): Record<string, number> {
    const counts: Record<string, number> = {};
    
    for (const event of this.events) {
      counts[event.type] = (counts[event.type] || 0) + 1;
    }
    
    return counts;
  }
  
  /**
   * Export events to JSON
   */
  exportEvents(): string {
    return JSON.stringify(this.events);
  }
  
  /**
   * Import events from JSON
   */
  importEvents(json: string): void {
    try {
      const events = JSON.parse(json) as ChatEventUnion[];
      this.events = events;
    } catch (error) {
      console.error('Failed to import events:', error);
    }
  }
  
  /**
   * Get session metrics for analysis
   */
  getSessionMetrics(): Record<string, any> {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    // Count total events
    const totalEvents = this.events.length;
    
    // Count events in last 24 hours
    const recentEvents = this.getEventsByTimeRange(oneDayAgo, now);
    
    // Count sessions
    const sessionStartEvents = this.getEventsByType(ChatEventType.SESSION_STARTED);
    const sessionEndEvents = this.getEventsByType(ChatEventType.SESSION_ENDED);
    
    // Calculate total time spent (sum of all session durations)
    let totalTimeSpent = 0;
    sessionEndEvents.forEach(event => {
      if (typeof event.duration === 'number') {
        totalTimeSpent += event.duration;
      }
    });
    
    // Count events by type
    const eventCounts = this.getEventCountByType();
    
    return {
      totalEvents,
      recentEvents: recentEvents.length,
      sessionsStarted: sessionStartEvents.length,
      sessionsEnded: sessionEndEvents.length,
      totalTimeSpent,
      eventCounts
    };
  }
}

// Export a singleton instance
export const eventTracker = new EventTracker();
export default eventTracker;
