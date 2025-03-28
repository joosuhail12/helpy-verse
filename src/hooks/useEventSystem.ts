
import { useEffect, useCallback } from 'react';
import { eventManager } from '@/utils/events/eventManager';
import { ChatEventType, ChatEventUnion } from '@/utils/events/eventTypes';

/**
 * React hook for interacting with the event system
 */
export const useEventSystem = () => {
  /**
   * Subscribe to a specific event type
   */
  const subscribe = useCallback((
    eventType: ChatEventType, 
    callback: (event: ChatEventUnion) => void
  ) => {
    return eventManager.subscribe(eventType, callback);
  }, []);
  
  /**
   * Subscribe to all events
   */
  const subscribeToAll = useCallback((
    callback: (event: ChatEventUnion) => void
  ) => {
    return eventManager.subscribeToAll(callback);
  }, []);
  
  /**
   * Publish an event
   */
  const publish = useCallback((event: ChatEventUnion) => {
    eventManager.publish(event);
  }, []);
  
  /**
   * Create a specialized hook for a specific event type
   */
  const useEvent = <T extends ChatEventUnion>(
    eventType: ChatEventType,
    callback: (event: T) => void,
    deps: React.DependencyList = []
  ) => {
    useEffect(() => {
      const unsubscribe = eventManager.subscribe(eventType, callback as (event: ChatEventUnion) => void);
      return unsubscribe;
    }, [...deps]);
  };
  
  return {
    subscribe,
    subscribeToAll,
    publish,
    useEvent
  };
};

/**
 * Hook for handling specific event types
 */
export const useEventListener = <T extends ChatEventUnion>(
  eventType: ChatEventType,
  callback: (event: T) => void,
  deps: React.DependencyList = []
) => {
  useEffect(() => {
    const unsubscribe = eventManager.subscribe(
      eventType, 
      callback as (event: ChatEventUnion) => void
    );
    return unsubscribe;
  }, deps);
};

/**
 * Convenience function to emit events
 */
export const emitEvent = (event: ChatEventUnion) => {
  eventManager.publish(event);
};
