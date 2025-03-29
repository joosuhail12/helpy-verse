
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
    headerBackground: string;
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
    headerTitle: string;
  };
  features: {
    typingIndicator: boolean;
    reactions: boolean;
    fileAttachments: boolean;
    readReceipts: boolean;
  };
  styles?: {
    fontFamily: string;
    launcherStyle: 'circle' | 'rectangle';
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
    inputBackground: '#f9f9f9',
    headerBackground: '#9b87f5'
  },
  position: 'right',
  compact: false,
  labels: {
    welcomeTitle: 'Hello there.',
    welcomeSubtitle: 'How can we help?',
    askQuestionButton: 'Ask a question',
    recentMessagesTitle: 'Recent messages',
    noMessagesText: 'No messages yet. Start a conversation!',
    messagePlaceholder: 'Type a message...',
    headerTitle: 'Chat with us'
  },
  features: {
    typingIndicator: true,
    reactions: true,
    fileAttachments: true,
    readReceipts: true
  },
  styles: {
    fontFamily: 'Inter, system-ui, sans-serif',
    launcherStyle: 'circle'
  }
};

interface ThemeContextType extends ThemeConfig {
  updateTheme: (theme: Partial<ThemeConfig>) => void;
}

// Create a context with a specific name to avoid conflicts
const ChatWidgetThemeContext = createContext<ThemeContextType | undefined>(undefined);

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
    },
    features: {
      ...defaultTheme.features,
      ...(initialTheme.features || {})
    },
    styles: {
      ...defaultTheme.styles,
      ...(initialTheme.styles || {})
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
      },
      features: {
        ...prev.features,
        ...(newTheme.features || {})
      },
      styles: {
        ...prev.styles,
        ...(newTheme.styles || {})
      }
    }));
  };

  return (
    <ChatWidgetThemeContext.Provider value={{ ...theme, updateTheme }}>
      <div className="chat-widget-theme-scope">
        {children}
      </div>
    </ChatWidgetThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ChatWidgetThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};
