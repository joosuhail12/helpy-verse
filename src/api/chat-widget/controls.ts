
/**
 * Widget controls for opening, closing, and toggling the chat widget
 */
import { isWidgetInitialized, getWidgetConfig } from './initialize';

// Widget state
let widgetOpen = false;
let widgetElement: HTMLElement | null = null;
let toggleButtonElement: HTMLElement | null = null;

/**
 * Initialize the widget DOM elements
 */
const initializeWidgetElements = (): void => {
  if (!widgetElement) {
    widgetElement = document.getElementById('chat-widget-container');
  }
  
  if (!toggleButtonElement) {
    toggleButtonElement = document.getElementById('chat-widget-toggle');
  }
  
  // Create elements if they don't exist
  if (!widgetElement) {
    widgetElement = document.createElement('div');
    widgetElement.id = 'chat-widget-container';
    widgetElement.style.display = 'none';
    document.body.appendChild(widgetElement);
  }
  
  if (!toggleButtonElement) {
    toggleButtonElement = document.createElement('button');
    toggleButtonElement.id = 'chat-widget-toggle';
    toggleButtonElement.setAttribute('aria-label', widgetOpen ? 'Close chat' : 'Open chat');
    document.body.appendChild(toggleButtonElement);
    
    // Add event listener
    toggleButtonElement.addEventListener('click', toggleWidget);
  }
};

/**
 * Open the chat widget
 */
export const openWidget = (): boolean => {
  try {
    if (!isWidgetInitialized()) {
      console.warn('Chat widget not initialized. Call initializeChatWidget() first.');
      return false;
    }
    
    initializeWidgetElements();
    
    if (widgetElement) {
      widgetElement.style.display = 'block';
      widgetOpen = true;
      
      if (toggleButtonElement) {
        toggleButtonElement.setAttribute('aria-label', 'Close chat');
      }
      
      // Trigger event if provided
      const config = getWidgetConfig();
      if (config?.events?.onWidgetOpened) {
        config.events.onWidgetOpened();
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Failed to open widget:', error);
    return false;
  }
};

/**
 * Close the chat widget
 */
export const closeWidget = (): boolean => {
  try {
    if (!isWidgetInitialized()) {
      console.warn('Chat widget not initialized. Call initializeChatWidget() first.');
      return false;
    }
    
    initializeWidgetElements();
    
    if (widgetElement) {
      widgetElement.style.display = 'none';
      widgetOpen = false;
      
      if (toggleButtonElement) {
        toggleButtonElement.setAttribute('aria-label', 'Open chat');
      }
      
      // Trigger event if provided
      const config = getWidgetConfig();
      if (config?.events?.onWidgetClosed) {
        config.events.onWidgetClosed();
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Failed to close widget:', error);
    return false;
  }
};

/**
 * Toggle the chat widget open/closed
 */
export const toggleWidget = (): boolean => {
  return widgetOpen ? closeWidget() : openWidget();
};

/**
 * Check if the widget is currently open
 */
export const isWidgetOpen = (): boolean => {
  return widgetOpen;
};

/**
 * Set up a custom toggle button
 */
export const setCustomToggleButton = (element: HTMLElement): void => {
  // Remove listener from old button if it exists
  if (toggleButtonElement) {
    toggleButtonElement.removeEventListener('click', toggleWidget);
  }
  
  // Use the new element
  toggleButtonElement = element;
  toggleButtonElement.addEventListener('click', toggleWidget);
};
