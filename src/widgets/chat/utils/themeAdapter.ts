import { ThemeConfig as ContextThemeConfig } from '@/context/ThemeContext';
import { ThemeConfig as ApiThemeConfig } from '@/api/chat-widget/types';

/**
 * Adapts API theme config to Context theme config
 */
export const adaptApiThemeToContextTheme = (
  apiTheme?: Partial<ApiThemeConfig>
): Partial<ContextThemeConfig> => {
  if (!apiTheme) return {};
  
  return {
    colors: apiTheme.colors ? {
      // Map existing properties
      primary: apiTheme.colors.primary || '#9b87f5',
      primaryForeground: '#ffffff',
      background: apiTheme.colors.background || '#ffffff',
      backgroundSecondary: '#f9f9f9',
      inputBackground: '#ffffff',
      foreground: apiTheme.colors.foreground || '#000000',
      border: '#e5e7eb',
      userMessage: apiTheme.colors.userMessage || '#9b87f5',
      userMessageText: '#ffffff',
      agentMessage: apiTheme.colors.agentMessage || '#f3f4f6',
      agentMessageText: '#000000',
      error: '#ef4444',
      success: '#10b981'
    } : undefined,
    position: apiTheme.position,
    compact: apiTheme.compact,
    // We keep the other properties undefined so they use defaults
  };
};

/**
 * Adapts Context theme config to API theme config
 */
export const adaptContextThemeToApiTheme = (
  contextTheme: Partial<ContextThemeConfig>
): Partial<ApiThemeConfig> => {
  if (!contextTheme) return {};
  
  return {
    colors: contextTheme.colors ? {
      primary: contextTheme.colors.primary,
      background: contextTheme.colors.background,
      foreground: contextTheme.colors.foreground,
      userMessage: contextTheme.colors.userMessage,
      agentMessage: contextTheme.colors.agentMessage
    } : undefined,
    position: contextTheme.position,
    compact: contextTheme.compact
  };
};
