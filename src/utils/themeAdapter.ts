
import { ThemeConfig } from '@/context/ThemeContext';

/**
 * Adapts API theme config to Context theme config
 */
export const adaptApiThemeToContextTheme = (
  apiTheme?: Partial<any>
): Partial<ThemeConfig> => {
  if (!apiTheme) return {};
  
  const defaultLabels = {
    welcomeTitle: 'Hello there.',
    welcomeSubtitle: 'How can we help?',
    sendButton: 'Send',
    placeholder: 'Type a message...',
    noMessagesText: "You don't have any conversations yet",
    recentMessagesTitle: "Recent Conversations"
  };
  
  return {
    colors: apiTheme.colors ? {
      primary: apiTheme.colors.primary || '#9b87f5',
      primaryForeground: '#ffffff',
      background: apiTheme.colors.background || '#ffffff',
      backgroundSecondary: '#f9f9f9',
      inputBackground: '#ffffff',
      foreground: apiTheme.colors.foreground || '#000000',
      border: '#e5e7eb',
      muted: '#f3f4f6',
      accent: '#f9fafb',
      userMessage: apiTheme.colors.userMessage || '#9b87f5',
      userMessageText: '#ffffff',
      agentMessage: apiTheme.colors.agentMessage || '#f3f4f6',
      agentMessageText: '#000000',
      error: apiTheme.colors.error || '#ef4444',
      success: apiTheme.colors.success || '#10b981'
    } : undefined,
    position: apiTheme.position,
    compact: apiTheme.compact,
    labels: apiTheme.labels ? {
      ...defaultLabels,
      ...(apiTheme.labels || {})
    } : undefined,
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
  contextTheme: Partial<ThemeConfig>
): Partial<any> => {
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
    labels: contextTheme.labels ? {
      welcomeTitle: contextTheme.labels.welcomeTitle,
      welcomeSubtitle: contextTheme.labels.welcomeSubtitle,
      sendButton: contextTheme.labels.sendButton,
      placeholder: contextTheme.labels.placeholder,
      noMessagesText: contextTheme.labels.noMessagesText,
      recentMessagesTitle: contextTheme.labels.recentMessagesTitle,
      askQuestionButton: contextTheme.labels.askQuestionButton
    } : undefined,
    features: contextTheme.features ? {
      typingIndicator: contextTheme.features.typingIndicator,
      reactions: contextTheme.features.reactions,
      fileAttachments: contextTheme.features.fileAttachments,
      readReceipts: contextTheme.features.readReceipts
    } : undefined
  };
};
