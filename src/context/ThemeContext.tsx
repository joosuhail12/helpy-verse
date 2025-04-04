
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
  }
};

interface ThemeContextType extends ThemeConfig {
  updateTheme: (theme: Partial<ThemeConfig>) => void;
}

// Create the context with a default undefined value that will be properly 
// initialized in the provider
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: Partial<ThemeConfig>;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, initialTheme = {} }) => {
  const [theme, setTheme] = useState<ThemeConfig>({
    ...defaultTheme,
    ...initialTheme,
    colors: {
      ...defaultTheme.colors,
      ...(initialTheme.colors || {})
    },
    labels: {
      ...defaultTheme.labels,
      ...(initialTheme.labels || {})
    }
  });

  const updateTheme = (newTheme: Partial<ThemeConfig>) => {
    setTheme(prev => ({
      ...prev,
      ...newTheme,
      colors: {
        ...prev.colors,
        ...(newTheme.colors || {})
      },
      labels: {
        ...prev.labels,
        ...(newTheme.labels || {})
      }
    }));
  };

  // Provide both the theme state and the updateTheme function
  return (
    <ThemeContext.Provider value={{ ...theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context with proper error handling
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};
