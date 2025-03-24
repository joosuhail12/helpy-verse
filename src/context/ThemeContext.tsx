
import React, { createContext, useContext, useState } from 'react';

export interface ThemeConfig {
  colors: {
    primary: string;
    primaryForeground: string;
    foreground: string;
    background: string;
    border: string;
    userMessage: string;
    userMessageText: string;
    agentMessage: string;
    agentMessageText: string;
  };
  labels: {
    welcomeTitle: string;
    welcomeSubtitle: string;
    recentMessagesTitle: string;
    askQuestionButton: string;
    noMessagesText: string;
    messageInputPlaceholder: string;
  };
  position?: 'left' | 'right';
  compact?: boolean;
}

const defaultTheme: ThemeConfig = {
  colors: {
    primary: '#8B5CF6',
    primaryForeground: '#ffffff',
    foreground: '#1A1F2C',
    background: '#ffffff',
    border: '#e5e7eb',
    userMessage: '#8B5CF6',
    userMessageText: '#ffffff',
    agentMessage: '#f3f4f6',
    agentMessageText: '#1A1F2C',
  },
  labels: {
    welcomeTitle: 'Welcome to',
    welcomeSubtitle: 'Pullse Chat',
    recentMessagesTitle: 'Recent Messages',
    askQuestionButton: 'Ask a question',
    noMessagesText: 'No messages yet. Start the conversation!',
    messageInputPlaceholder: 'Type a message...',
  },
  position: 'right',
  compact: false,
};

interface ThemeContextValue {
  colors: ThemeConfig['colors'];
  labels: ThemeConfig['labels'];
  position: 'left' | 'right';
  compact: boolean;
  updateTheme: (newTheme: Partial<ThemeConfig>) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: Partial<ThemeConfig>;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, initialTheme = {} }) => {
  const [theme, setTheme] = useState<ThemeConfig>({
    ...defaultTheme,
    colors: { ...defaultTheme.colors, ...(initialTheme.colors || {}) },
    labels: { ...defaultTheme.labels, ...(initialTheme.labels || {}) },
    position: initialTheme.position || defaultTheme.position,
    compact: initialTheme.compact !== undefined ? initialTheme.compact : defaultTheme.compact,
  });

  const updateTheme = (newTheme: Partial<ThemeConfig>) => {
    setTheme(prevTheme => ({
      ...prevTheme,
      colors: { ...prevTheme.colors, ...(newTheme.colors || {}) },
      labels: { ...prevTheme.labels, ...(newTheme.labels || {}) },
      position: newTheme.position || prevTheme.position,
      compact: newTheme.compact !== undefined ? newTheme.compact : prevTheme.compact,
    }));
  };

  return (
    <ThemeContext.Provider
      value={{
        colors: theme.colors,
        labels: theme.labels,
        position: theme.position || 'right',
        compact: !!theme.compact,
        updateTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};
