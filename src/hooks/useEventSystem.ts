
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatEventType, ChatEventUnion } from '@/utils/events/eventTypes';
import eventManager from '@/utils/events/eventManager';

type EventCallback = (event: any) => void;

interface EventSystem {
  emit: (eventType: string, data?: any) => void;
  subscribe: (eventType: string, callback: EventCallback) => () => void;
}

export function useEventSystem(): EventSystem {
  const emit = useCallback((eventType: string, data: any = {}) => {
    const event = {
      ...data,
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      type: eventType as ChatEventType,
      source: data.source || 'client'
    };
    
    eventManager.publish(event as ChatEventUnion);
  }, []);
  
  const subscribe = useCallback((eventType: string, callback: EventCallback) => {
    return eventManager.subscribe(eventType as ChatEventType, callback);
  }, []);
  
  return {
    emit,
    subscribe
  };
}

// Add a hook to listen to events
export function useEventListener(eventType: ChatEventType, callback: (event: ChatEventUnion) => void) {
  return eventManager.subscribe(eventType, callback);
}

export default useEventSystem;
