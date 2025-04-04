
/**
 * Appearance management for the chat widget
 */
import type { ThemeConfig } from './types';
import { isWidgetInitialized } from './initialize';

// Default theme
const defaultTheme: ThemeConfig = {
  colors: {
    primary: '#9b87f5',
    background: '#ffffff',
    foreground: '#1f2937',
    userMessage: '#f3f4f6',
    agentMessage: '#9b87f5'
  },
  position: 'right',
  compact: false
};

// Current theme
let currentTheme: ThemeConfig = { ...defaultTheme };

/**
 * Update the widget theme
 */
export const updateWidgetTheme = (themeUpdates: Partial<ThemeConfig>): ThemeConfig => {
  if (!isWidgetInitialized()) {
    console.warn('Chat widget not initialized. Theme will be applied after initialization.');
  }
  
  // Deep merge the theme updates
  currentTheme = {
    ...currentTheme,
    colors: {
      ...currentTheme.colors,
      ...(themeUpdates.colors || {})
    },
    position: themeUpdates.position || currentTheme.position,
    compact: themeUpdates.compact !== undefined ? themeUpdates.compact : currentTheme.compact
  };
  
  // Apply theme to DOM
  const root = document.documentElement;
  
  if (currentTheme.colors?.primary) {
    root.style.setProperty('--chat-primary-color', currentTheme.colors.primary);
  }
  
  if (currentTheme.colors?.background) {
    root.style.setProperty('--chat-background-color', currentTheme.colors.background);
  }
  
  if (currentTheme.colors?.foreground) {
    root.style.setProperty('--chat-foreground-color', currentTheme.colors.foreground);
  }
  
  if (currentTheme.colors?.userMessage) {
    root.style.setProperty('--chat-user-message-color', currentTheme.colors.userMessage);
  }
  
  if (currentTheme.colors?.agentMessage) {
    root.style.setProperty('--chat-agent-message-color', currentTheme.colors.agentMessage);
  }
  
  // Add position class
  document.body.classList.remove('chat-position-left', 'chat-position-right');
  document.body.classList.add(`chat-position-${currentTheme.position}`);
  
  // Add compact class if needed
  if (currentTheme.compact) {
    document.body.classList.add('chat-compact');
  } else {
    document.body.classList.remove('chat-compact');
  }
  
  return { ...currentTheme };
};

/**
 * Get the current widget theme
 */
export const getWidgetTheme = (): ThemeConfig => {
  return { ...currentTheme };
};

/**
 * Reset the theme to defaults
 */
export const resetWidgetTheme = (): ThemeConfig => {
  currentTheme = { ...defaultTheme };
  updateWidgetTheme(currentTheme);
  return { ...currentTheme };
};
