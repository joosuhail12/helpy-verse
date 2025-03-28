
import React, { createContext, useContext, useState } from 'react';
import { ThemeConfig } from '@/components/chat-widget/components/conversation/types';

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
  // Add additional colors with defaults
  muted: '#F3F4F6',
  mutedForeground: '#6B7280',
  secondary: '#F3F4F6',
  secondaryForeground: '#111827',
  outgoingMessage: '#4F46E5',
  outgoingMessageForeground: '#FFFFFF',
  incomingMessage: '#F3F4F6',
  incomingMessageForeground: '#111827'
};

const defaultLabels = {
  welcomeTitle: 'Hello there.',
  welcomeSubtitle: 'How can we help?',
  askQuestionButton: 'Ask a question',
  recentMessagesTitle: 'Recent messages',
  noMessagesText: 'No messages yet. Start a conversation!',
  messagePlaceholder: 'Type a message...'
};

export type ThemeContextType = {
  colors: typeof defaultColors;
  labels: typeof defaultLabels;
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
  const [themeState, setThemeState] = useState<ThemeConfig>({
    colors: { ...defaultColors, ...initialTheme.colors },
    position: initialTheme.position || 'right',
    compact: initialTheme.compact || false,
    labels: { ...defaultLabels, ...initialTheme.labels }
  });

  const updateTheme = (theme: Partial<ThemeConfig>) => {
    setThemeState(prev => ({
      ...prev,
      colors: { ...prev.colors, ...theme.colors },
      position: theme.position || prev.position,
      compact: theme.compact !== undefined ? theme.compact : prev.compact,
      labels: { ...prev.labels, ...theme.labels }
    }));
  };

  return (
    <ThemeContext.Provider value={{ 
      colors: themeState.colors, 
      labels: themeState.labels || defaultLabels,
      updateTheme 
    }}>
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
