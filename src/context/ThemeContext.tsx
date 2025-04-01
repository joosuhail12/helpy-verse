
import React, { createContext, useContext, useState } from 'react';

export interface ThemeConfig {
  colors: {
    primary: string;
    background: string;
    foreground: string;
    border: string;
    muted: string;
    accent: string;
  };
  position: 'left' | 'right';
  compact: boolean;
  labels: {
    welcomeTitle: string;
    welcomeSubtitle: string;
    placeholder: string;
    sendButton: string;
    noMessagesText: string;
    recentMessagesTitle: string;
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
    background: '#ffffff',
    foreground: '#1f2937',
    border: '#e5e7eb',
    muted: '#f3f4f6',
    accent: '#f9fafb',
  },
  position: 'right',
  compact: false,
  labels: {
    welcomeTitle: 'Hello there.',
    welcomeSubtitle: 'How can we help?',
    placeholder: 'Type a message...',
    sendButton: 'Send',
    noMessagesText: "You don't have any conversations yet",
    recentMessagesTitle: "Recent Conversations"
  },
  features: {
    typingIndicator: true,
    reactions: true,
    fileAttachments: true,
    readReceipts: true,
  }
};

interface ThemeContextProps {
  theme: ThemeConfig;
  colors: ThemeConfig['colors'];
  labels: ThemeConfig['labels'];
  features: ThemeConfig['features'];
  setTheme: (theme: Partial<ThemeConfig>) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
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
      ...initialTheme.colors
    },
    labels: {
      ...defaultTheme.labels,
      ...initialTheme.labels
    },
    features: {
      ...defaultTheme.features,
      ...initialTheme.features
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
  
  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        setTheme, 
        colors: theme.colors, 
        labels: theme.labels,
        features: theme.features 
      }}
    >
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
