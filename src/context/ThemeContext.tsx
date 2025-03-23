
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ThemeColors {
  primary: string;
  primaryForeground: string;
  background: string;
  foreground: string;
  border: string;
  userMessage: string;
  userMessageText: string;
  agentMessage: string;
  agentMessageText: string;
  inputBackground: string;
}

export interface ThemeConfig {
  colors: ThemeColors;
  position: 'left' | 'right';
  compact: boolean;
  labels: {
    welcomeTitle: string;
    welcomeSubtitle: string;
    askQuestionButton: string;
    recentMessagesTitle: string;
    noMessagesText: string;
    startConversationButton: string;
    messagePlaceholder: string;
  };
}

const defaultLabels = {
  welcomeTitle: 'Hello there.',
  welcomeSubtitle: 'How can we help?',
  askQuestionButton: 'Ask a question',
  recentMessagesTitle: 'Recent message',
  noMessagesText: 'No messages yet. Start a conversation!',
  startConversationButton: 'Start a conversation',
  messagePlaceholder: 'Type a message...'
};

const defaultTheme: ThemeConfig = {
  colors: {
    primary: '#9b87f5',
    primaryForeground: '#ffffff',
    background: '#ffffff',
    foreground: '#1A1F2C',
    border: '#e1e1e1',
    userMessage: '#9b87f5',
    userMessageText: '#ffffff',
    agentMessage: '#f1f1f1',
    agentMessageText: '#1A1F2C',
    inputBackground: '#f9f9f9',
  },
  position: 'right',
  compact: false,
  labels: defaultLabels
};

interface ThemeContextType {
  colors: ThemeColors;
  position: 'left' | 'right';
  compact: boolean;
  labels: typeof defaultLabels;
  setTheme: (theme: Partial<ThemeConfig>) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  ...defaultTheme,
  setTheme: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{
  children: ReactNode;
  initialTheme?: Partial<ThemeConfig>;
}> = ({ children, initialTheme = {} }) => {
  const [theme, setThemeState] = useState<ThemeConfig>({
    ...defaultTheme,
    ...initialTheme,
    colors: { ...defaultTheme.colors, ...initialTheme.colors },
    labels: { ...defaultTheme.labels, ...initialTheme.labels },
  });

  const setTheme = (newTheme: Partial<ThemeConfig>) => {
    setThemeState(prevTheme => ({
      ...prevTheme,
      ...newTheme,
      colors: { ...prevTheme.colors, ...newTheme.colors },
      labels: { ...prevTheme.labels, ...newTheme.labels },
    }));
  };

  return (
    <ThemeContext.Provider value={{ 
      colors: theme.colors, 
      position: theme.position, 
      compact: theme.compact, 
      labels: theme.labels, 
      setTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
