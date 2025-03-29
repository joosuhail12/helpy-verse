
import React, { createContext, useContext, useState } from 'react';

export interface ThemeConfig {
  colors: {
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
  };
  position: 'left' | 'right';
  compact: boolean;
  labels: {
    welcomeTitle: string;
    welcomeSubtitle: string;
    askQuestionButton: string;
    recentMessagesTitle: string;
    noMessagesText: string;
    messagePlaceholder: string;
  };
  features?: {
    typingIndicator?: boolean;
    reactions?: boolean;
    fileAttachments?: boolean;
    readReceipts?: boolean;
  };
}

interface ThemeContextValue extends ThemeConfig {
  setTheme: (theme: Partial<ThemeConfig>) => void;
  setColors: (colors: Partial<ThemeConfig['colors']>) => void;
  setPosition: (position: ThemeConfig['position']) => void;
  setCompact: (compact: boolean) => void;
}

const defaultTheme: ThemeConfig = {
  colors: {
    primary: '#9b87f5',
    primaryForeground: '#ffffff',
    background: '#ffffff',
    backgroundSecondary: '#f9f9f9',
    foreground: '#1A1F2C',
    border: '#eaeaea',
    userMessage: '#9b87f5',
    userMessageText: '#ffffff',
    agentMessage: '#f1f1f1',
    agentMessageText: '#1A1F2C',
    inputBackground: '#f9f9f9'
  },
  position: 'right',
  compact: false,
  labels: {
    welcomeTitle: 'Hello there.',
    welcomeSubtitle: 'How can we help?',
    askQuestionButton: 'Ask a question',
    recentMessagesTitle: 'Recent messages',
    noMessagesText: 'No messages yet. Start a conversation!',
    messagePlaceholder: 'Type a message...'
  },
  features: {
    typingIndicator: true,
    reactions: true,
    fileAttachments: true,
    readReceipts: true
  }
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: Partial<ThemeConfig>;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, initialTheme = {} }) => {
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

  return (
    <ThemeContext.Provider value={{ 
      ...theme, 
      setTheme,
      setColors,
      setPosition,
      setCompact
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
