
import React, { createContext, useContext, useState } from 'react';

export interface ThemeConfig {
  colors?: {
    primary: string;
    primaryForeground: string;
    background: string;
    backgroundSecondary: string;
    foreground: string;
    border: string;
    userMessage: string;
    userMessageText: string;
    agentMessage: string;
    agentMessageText: string;
    inputBackground: string;
    muted: string;
    mutedForeground: string;
    secondary: string;
    secondaryForeground: string;
    outgoingMessage: string;
    outgoingMessageForeground: string;
    incomingMessage: string;
    incomingMessageForeground: string;
    primaryDark: string;
    accent: string;
    accentForeground: string;
    success: string;
    successForeground: string;
    warning: string;
    warningForeground: string;
    error: string;
    errorForeground: string;
    headerBackground: string;
    headerForeground: string;
    navigationBackground: string;
    navigationForeground: string;
  };
  position?: 'left' | 'right';
  compact?: boolean;
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  fontFamily?: string;
  animation?: {
    speed?: 'slow' | 'normal' | 'fast';
    type?: 'slide' | 'fade' | 'scale' | 'none';
  };
  labels: {
    welcomeTitle: string;
    welcomeSubtitle: string;
    askQuestionButton: string;
    recentMessagesTitle: string;
    noMessagesText: string;
    messagePlaceholder: string;
    chatTitle: string;
    sendButtonText: string;
    attachmentButtonLabel: string;
    conversationStartedText: string;
    poweredByText: string;
    loadMoreText: string;
    typingText: string;
  };
  branding?: {
    logoUrl?: string;
    logoWidth?: number;
    logoHeight?: number;
    showPoweredBy?: boolean;
    favicon?: string;
  };
}

const defaultColors = {
  primary: '#4F46E5',
  primaryForeground: '#FFFFFF',
  background: '#FFFFFF',
  backgroundSecondary: '#F9FAFB',
  foreground: '#111827',
  border: '#E5E7EB',
  userMessage: '#4F46E5',
  userMessageText: '#FFFFFF',
  agentMessage: '#F3F4F6',
  agentMessageText: '#111827',
  inputBackground: '#F9FAFB',
  muted: '#F3F4F6',
  mutedForeground: '#6B7280',
  secondary: '#F3F4F6',
  secondaryForeground: '#111827',
  outgoingMessage: '#4F46E5',
  outgoingMessageForeground: '#FFFFFF',
  incomingMessage: '#F3F4F6',
  incomingMessageForeground: '#111827',
  primaryDark: '#3730A3',
  accent: '#8B5CF6',
  accentForeground: '#FFFFFF',
  success: '#10B981',
  successForeground: '#FFFFFF',
  warning: '#F59E0B',
  warningForeground: '#FFFFFF',
  error: '#EF4444',
  errorForeground: '#FFFFFF',
  headerBackground: '#FFFFFF',
  headerForeground: '#111827',
  navigationBackground: '#F9FAFB',
  navigationForeground: '#111827'
};

const defaultLabels = {
  welcomeTitle: 'Hello there.',
  welcomeSubtitle: 'How can we help?',
  askQuestionButton: 'Ask a question',
  recentMessagesTitle: 'Recent messages',
  noMessagesText: 'No messages yet. Start a conversation!',
  messagePlaceholder: 'Type a message...',
  chatTitle: 'Conversation',
  sendButtonText: 'Send',
  attachmentButtonLabel: 'Attach file',
  conversationStartedText: 'Conversation started',
  poweredByText: 'Powered by',
  loadMoreText: 'Load more',
  typingText: 'typing...'
};

export type ThemeContextType = {
  colors: typeof defaultColors;
  labels: typeof defaultLabels;
  position?: 'left' | 'right';
  compact?: boolean;
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  fontFamily?: string;
  animation?: {
    speed?: 'slow' | 'normal' | 'fast';
    type?: 'slide' | 'fade' | 'scale' | 'none';
  };
  branding?: {
    logoUrl?: string;
    logoWidth?: number;
    logoHeight?: number;
    showPoweredBy?: boolean;
    favicon?: string;
  };
  updateTheme: (theme: Partial<ThemeConfig>) => void;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: Partial<ThemeConfig>;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  initialTheme = {} 
}) => {
  // Ensure all required properties have default values
  const mergedColors = { ...defaultColors, ...initialTheme.colors };
  const mergedLabels = { ...defaultLabels, ...initialTheme.labels };

  const [themeState, setThemeState] = useState<ThemeConfig>({
    colors: mergedColors,
    position: initialTheme.position || 'right',
    compact: initialTheme.compact || false,
    radius: initialTheme.radius || 'md',
    shadow: initialTheme.shadow || 'md',
    fontFamily: initialTheme.fontFamily,
    animation: initialTheme.animation || { speed: 'normal', type: 'fade' },
    labels: mergedLabels,
    branding: initialTheme.branding || { showPoweredBy: true }
  });

  const updateTheme = (theme: Partial<ThemeConfig>) => {
    setThemeState(prev => {
      // Create merged values to ensure all required properties have values
      const updatedColors = { ...prev.colors, ...theme.colors };
      const updatedLabels = { ...prev.labels, ...theme.labels };
      
      return {
        ...prev,
        colors: updatedColors,
        position: theme.position || prev.position,
        compact: theme.compact !== undefined ? theme.compact : prev.compact,
        radius: theme.radius || prev.radius,
        shadow: theme.shadow || prev.shadow,
        fontFamily: theme.fontFamily || prev.fontFamily,
        animation: { ...prev.animation, ...theme.animation },
        labels: updatedLabels,
        branding: { ...prev.branding, ...theme.branding }
      };
    });
  };

  const contextValue: ThemeContextType = {
    colors: themeState.colors,
    labels: themeState.labels,
    position: themeState.position,
    compact: themeState.compact,
    radius: themeState.radius,
    shadow: themeState.shadow,
    fontFamily: themeState.fontFamily,
    animation: themeState.animation,
    branding: themeState.branding,
    updateTheme
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};
