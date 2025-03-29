
import { useEffect } from 'react';
import { useChatWidget } from '@/context/ChatWidgetContext';
import { ChatWidgetConfig } from '@/api/chat-widget/types';
import { getInitializeEvent } from '@/api/chat-widget/initialize';
import { getWidgetEvents } from '@/api/chat-widget/controls';

/**
 * Hook to initialize the chat widget and listen for control events
 */
export const useChatWidgetInitializer = () => {
  const { dispatch } = useChatWidget();
  
  useEffect(() => {
    // Listen for initialization events
    const handleInitialize = (event: CustomEvent<{ config: ChatWidgetConfig }>) => {
      if (event.detail && event.detail.config) {
        dispatch({ type: 'INITIALIZE', payload: event.detail.config });
      }
    };
    
    // Listen for control events
    const handleOpen = () => {
      dispatch({ type: 'OPEN_WIDGET' });
    };
    
    const handleClose = () => {
      dispatch({ type: 'CLOSE_WIDGET' });
    };
    
    const handleToggle = () => {
      dispatch({ type: 'TOGGLE_WIDGET' });
    };
    
    // Get event names
    const INITIALIZE_EVENT = getInitializeEvent();
    const WIDGET_EVENTS = getWidgetEvents();
    
    // Add event listeners
    window.addEventListener(INITIALIZE_EVENT, handleInitialize as EventListener);
    window.addEventListener(WIDGET_EVENTS.OPEN, handleOpen);
    window.addEventListener(WIDGET_EVENTS.CLOSE, handleClose);
    window.addEventListener(WIDGET_EVENTS.TOGGLE, handleToggle);
    
    // Cleanup
    return () => {
      window.removeEventListener(INITIALIZE_EVENT, handleInitialize as EventListener);
      window.removeEventListener(WIDGET_EVENTS.OPEN, handleOpen);
      window.removeEventListener(WIDGET_EVENTS.CLOSE, handleClose);
      window.removeEventListener(WIDGET_EVENTS.TOGGLE, handleToggle);
    };
  }, [dispatch]);
};

export default useChatWidgetInitializer;
