
import { eventManager } from './eventManager';
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
}

// Export a singleton instance
const eventTracker = new EventTracker();
export default eventTracker;
