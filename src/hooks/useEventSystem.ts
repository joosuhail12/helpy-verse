
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

type EventCallback = (event: any) => void;

interface EventSystem {
  emit: (eventType: string, data?: any) => void;
  subscribe: (eventType: string, callback: EventCallback) => () => void;
}

export function useEventSystem(): EventSystem {
  const emit = useCallback((eventType: string, data: any = {}) => {
    const event = new CustomEvent(eventType, {
      detail: {
        ...data,
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        eventType
      }
    });
    
    window.dispatchEvent(event);
    
    // Also log events in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Event] ${eventType}:`, data);
    }
  }, []);
  
  const subscribe = useCallback((eventType: string, callback: EventCallback) => {
    const handleEvent = (event: CustomEvent) => {
      callback(event.detail);
    };
    
    window.addEventListener(eventType, handleEvent as EventListener);
    
    return () => {
      window.removeEventListener(eventType, handleEvent as EventListener);
    };
  }, []);
  
  return {
    emit,
    subscribe
  };
}
