
import { useState, useCallback } from 'react';
import { ChatEventType, ChatEventUnion } from '@/utils/events/eventTypes';

type EventCallback = (event: any) => void;

interface EventSystemHookResult {
  emit: (eventType: ChatEventType, eventData?: any) => void;
  publish: (event: ChatEventUnion) => void;
  subscribe: (eventType: ChatEventType, callback: EventCallback) => () => void;
  lastEvent: ChatEventUnion | null;
}

// Global event bus for cross-component communication
const listeners: Record<string, EventCallback[]> = {};
let lastEventRecord: ChatEventUnion | null = null;

export const useEventSystem = (): EventSystemHookResult => {
  const [lastEvent, setLastEvent] = useState<ChatEventUnion | null>(lastEventRecord);

  // Emit an event with automatic timestamp and source
  const emit = useCallback((eventType: ChatEventType, eventData: any = {}) => {
    const event: ChatEventUnion = {
      type: eventType,
      timestamp: new Date().toISOString(),
      source: eventData.source || 'event-system',
      ...eventData
    };
    
    publish(event);
  }, []);

  // Publish a pre-formatted event
  const publish = useCallback((event: ChatEventUnion) => {
    // Update last event
    lastEventRecord = event;
    setLastEvent(event);
    
    // Notify listeners
    const eventListeners = listeners[event.type] || [];
    eventListeners.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error(`Error in event listener for ${event.type}:`, error);
      }
    });
    
    // Notify wildcard listeners
    const wildcardListeners = listeners['*'] || [];
    wildcardListeners.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error(`Error in wildcard event listener:`, error);
      }
    });
    
    // Log events in development environment
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[Event] ${event.type}`, event);
    }
  }, []);

  // Subscribe to an event
  const subscribe = useCallback((eventType: ChatEventType | '*', callback: EventCallback) => {
    if (!listeners[eventType]) {
      listeners[eventType] = [];
    }
    
    listeners[eventType].push(callback);
    
    // Return unsubscribe function
    return () => {
      if (listeners[eventType]) {
        listeners[eventType] = listeners[eventType].filter(cb => cb !== callback);
        
        // Clean up empty listener arrays
        if (listeners[eventType].length === 0) {
          delete listeners[eventType];
        }
      }
    };
  }, []);

  return {
    emit,
    publish,
    subscribe,
    lastEvent
  };
};

export default useEventSystem;
