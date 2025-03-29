
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ThemeConfig {
  colors: {
    primary: string;
    primaryForeground: string;
    background: string;
    backgroundSecondary: string;
    inputBackground: string;
    foreground: string;
    border: string;
    userMessage: string;
    userMessageText: string;
    agentMessage: string;
    agentMessageText: string;
    error: string;
    success: string;
  };
  position: 'left' | 'right';
  compact: boolean;
  labels: {
    welcomeTitle: string;
    welcomeSubtitle: string;
    sendButton: string;
    placeholder: string;
    recentMessagesTitle?: string;
    askQuestionButton?: string;
    noMessagesText?: string;
  };
  features: {
    typingIndicator: boolean;
    reactions: boolean;
    fileAttachments: boolean;
    readReceipts: boolean;
  };
}

const defaultTheme: ThemeConfig = {
  colors: {
    primary: '#9b87f5',
    primaryForeground: '#ffffff',
    background: '#ffffff',
    backgroundSecondary: '#f9f9f9',
    inputBackground: '#ffffff',
    foreground: '#000000',
    border: '#e5e7eb',
    userMessage: '#9b87f5',
    userMessageText: '#ffffff',
    agentMessage: '#f3f4f6',
    agentMessageText: '#000000',
    error: '#ef4444',
    success: '#10b981'
  },
  position: 'right',
  compact: false,
  labels: {
    welcomeTitle: 'Hello there.',
    welcomeSubtitle: 'How can we help?',
    sendButton: 'Send',
    placeholder: 'Type a message...',
    recentMessagesTitle: 'Recent Messages',
    askQuestionButton: 'Ask a question',
    noMessagesText: 'No messages yet'
  },
  features: {
    typingIndicator: true,
    reactions: true,
    fileAttachments: true,
    readReceipts: true
  }
};

type ThemeContextType = {
  colors: ThemeConfig['colors'];
  position: ThemeConfig['position'];
  compact: ThemeConfig['compact'];
  labels: ThemeConfig['labels'];
  features: ThemeConfig['features'];
  setTheme: (theme: Partial<ThemeConfig>) => void;
  setColors: (colors: Partial<ThemeConfig['colors']>) => void;
  setPosition: (position: ThemeConfig['position']) => void;
  setCompact: (compact: boolean) => void;
  setLabels: (labels: Partial<ThemeConfig['labels']>) => void;
  setFeatures: (features: Partial<ThemeConfig['features']>) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  ...defaultTheme,
  setTheme: () => {},
  setColors: () => {},
  setPosition: () => {},
  setCompact: () => {},
  setLabels: () => {},
  setFeatures: () => {}
});

export const useThemeContext = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: Partial<ThemeConfig>;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialTheme = {}
}) => {
  const [theme, setThemeState] = useState<ThemeConfig>({
    ...defaultTheme,
    ...initialTheme,
    colors: {
      ...defaultTheme.colors,
      ...(initialTheme.colors || {})
    },
    labels: {
      ...defaultTheme.labels,
      ...(initialTheme.labels || {})
    },
    features: {
      ...defaultTheme.features,
      ...(initialTheme.features || {})
    }
  });

  const setTheme = (newTheme: Partial<ThemeConfig>) => {
    setThemeState(prev => ({
      ...prev,
      ...newTheme,
      colors: {
        ...prev.colors,
        ...(newTheme.colors || {})
      },
      labels: {
        ...prev.labels,
        ...(newTheme.labels || {})
      },
      features: {
        ...prev.features,
        ...(newTheme.features || {})
      }
    }));
  };

  const setColors = (colors: Partial<ThemeConfig['colors']>) => {
    setThemeState(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        ...colors
      }
    }));
  };

  const setPosition = (position: ThemeConfig['position']) => {
    setThemeState(prev => ({
      ...prev,
      position
    }));
  };

  const setCompact = (compact: boolean) => {
    setThemeState(prev => ({
      ...prev,
      compact
    }));
  };

  const setLabels = (labels: Partial<ThemeConfig['labels']>) => {
    setThemeState(prev => ({
      ...prev,
      labels: {
        ...prev.labels,
        ...labels
      }
    }));
  };

  const setFeatures = (features: Partial<ThemeConfig['features']>) => {
    setThemeState(prev => ({
      ...prev,
      features: {
        ...prev.features,
        ...features
      }
    }));
  };

  return (
    <ThemeContext.Provider
      value={{
        colors: theme.colors,
        position: theme.position,
        compact: theme.compact,
        labels: theme.labels,
        features: theme.features,
        setTheme,
        setColors,
        setPosition,
        setCompact,
        setLabels,
        setFeatures
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
