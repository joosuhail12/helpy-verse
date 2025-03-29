
import { ThemeConfig as ContextThemeConfig } from '@/context/ThemeContext';
import { ThemeConfig as ApiThemeConfig } from '../types';

/**
 * Adapts API theme config to Context theme config
 */
export const adaptApiThemeToContextTheme = (
  apiTheme?: Partial<ApiThemeConfig>
): Partial<ContextThemeConfig> => {
  if (!apiTheme) return {};
  
  return {
    colors: apiTheme.colors ? {
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
      error: apiTheme.colors.error || '#ef4444',
      success: apiTheme.colors.success || '#10b981'
    } : undefined,
    position: apiTheme.position,
    compact: apiTheme.compact,
    labels: apiTheme.labels,
    features: apiTheme.features ? {
      typingIndicator: apiTheme.features.typingIndicator,
      reactions: apiTheme.features.reactions,
      fileAttachments: apiTheme.features.fileAttachments,
      readReceipts: apiTheme.features.readReceipts
    } : undefined
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
      agentMessage: contextTheme.colors.agentMessage,
      error: contextTheme.colors.error,
      success: contextTheme.colors.success
    } : undefined,
    position: contextTheme.position,
    compact: contextTheme.compact,
    labels: contextTheme.labels,
    features: contextTheme.features ? {
      typingIndicator: contextTheme.features.typingIndicator,
      reactions: contextTheme.features.reactions,
      fileAttachments: contextTheme.features.fileAttachments,
      readReceipts: contextTheme.features.readReceipts
    } : undefined
  };
};
