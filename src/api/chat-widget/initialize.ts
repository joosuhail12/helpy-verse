
/**
 * Chat widget initialization 
 */
import { getAblyChannel } from '@/utils/ably';
import type { ChatWidgetConfig } from './types';
import { updateWidgetTheme } from './appearance';
import { getWidgetEvents } from './controls';

// Store the configuration globally
let widgetConfig: ChatWidgetConfig | null = null;
let isInitialized = false;

// Event name for initialization
const INITIALIZE_EVENT = 'chat-widget-initialize';

/**
 * Initialize the chat widget with configuration
 */
export const initializeChatWidget = async (config: ChatWidgetConfig): Promise<boolean> => {
  try {
    if (isInitialized) {
      console.warn('Chat widget is already initialized. Call reset() first if you want to reinitialize.');
      return true;
    }
    
    // Store configuration
    widgetConfig = config;
    
    // Set up theme
    if (config.theme) {
      updateWidgetTheme(config.theme);
    }
    
    // Initialize Ably connection if needed
    if (config.workspaceId) {
      // Initialize the channel
      const channelName = `workspace:${config.workspaceId}:system`;
      await getAblyChannel(channelName);
    }
    
    // Dispatch an initialization event with the config
    window.dispatchEvent(new CustomEvent(INITIALIZE_EVENT, { 
      detail: { config } 
    }));
    
    // Mark as initialized
    isInitialized = true;
    
    console.log('Chat widget initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize chat widget:', error);
    return false;
  }
};

/**
 * Get the current widget configuration
 */
export const getWidgetConfig = (): ChatWidgetConfig | null => {
  return widgetConfig;
};

/**
 * Reset the chat widget (useful for testing or switching workspaces)
 */
export const resetChatWidget = (): void => {
  widgetConfig = null;
  isInitialized = false;
};

/**
 * Check if the widget is initialized
 */
export const isWidgetInitialized = (): boolean => {
  return isInitialized;
};

// Export event name for listeners
export const getInitializeEvent = () => INITIALIZE_EVENT;
