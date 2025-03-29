
/**
 * Widget controls for opening, closing, and toggling the chat widget
 */
import { getWidgetConfig, isWidgetInitialized } from './initialize';

// Use window events for cross-context communication
const WIDGET_EVENTS = {
  OPEN: 'chat-widget-open',
  CLOSE: 'chat-widget-close',
  TOGGLE: 'chat-widget-toggle'
};

// Track widget state
let isOpen = false;

/**
 * Open the chat widget
 */
export const openWidget = async (): Promise<boolean> => {
  try {
    if (!isWidgetInitialized()) {
      console.warn('Chat widget not initialized. Call initializeChatWidget() first.');
      return false;
    }
    
    // Dispatch a custom event that the widget can listen for
    window.dispatchEvent(new CustomEvent(WIDGET_EVENTS.OPEN));
    isOpen = true;
    
    return true;
  } catch (error) {
    console.error('Failed to open chat widget:', error);
    return false;
  }
};

/**
 * Close the chat widget
 */
export const closeWidget = async (): Promise<boolean> => {
  try {
    if (!isWidgetInitialized()) {
      console.warn('Chat widget not initialized. Call initializeChatWidget() first.');
      return false;
    }
    
    // Dispatch a custom event that the widget can listen for
    window.dispatchEvent(new CustomEvent(WIDGET_EVENTS.CLOSE));
    isOpen = false;
    
    return true;
  } catch (error) {
    console.error('Failed to close chat widget:', error);
    return false;
  }
};

/**
 * Toggle the chat widget state
 */
export const toggleWidget = async (): Promise<boolean> => {
  try {
    if (!isWidgetInitialized()) {
      console.warn('Chat widget not initialized. Call initializeChatWidget() first.');
      return false;
    }
    
    // Dispatch a custom event that the widget can listen for
    window.dispatchEvent(new CustomEvent(WIDGET_EVENTS.TOGGLE));
    isOpen = !isOpen;
    
    return true;
  } catch (error) {
    console.error('Failed to toggle chat widget:', error);
    return false;
  }
};

/**
 * Check if the widget is currently open
 */
export const isWidgetOpen = (): boolean => {
  return isOpen;
};

// Export event names for listeners
export const getWidgetEvents = () => WIDGET_EVENTS;
