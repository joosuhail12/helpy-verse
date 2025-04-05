
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the context shape
export interface ThemeConfig {
  colors: {
    primary: string;
    background: string;
    foreground: string; 
    userMessage: string;
    agentMessage: string;
  };
  position: 'left' | 'right';
  compact: boolean;
  positionOffset: {
    x: number;
    y: number;
  };
  labels: {
    welcomeTitle: string;
    welcomeSubtitle: string;
    askQuestionButton: string;
  };
  logo: string | null;
  launcherIcon: string | null;
}

interface ThemeContextType {
  colors: ThemeConfig['colors'];
  position: ThemeConfig['position'];
  compact: ThemeConfig['compact'];
  positionOffset: ThemeConfig['positionOffset'];
  labels: ThemeConfig['labels'];
  logo: ThemeConfig['logo'];
  launcherIcon: ThemeConfig['launcherIcon'];
  updateTheme: (config: Partial<ThemeConfig>) => void;
}

// Default theme configuration
const defaultTheme: ThemeConfig = {
  colors: {
    primary: '#7C3AED', // Purple
    background: '#FFFFFF',
    foreground: '#1F2937',
    userMessage: '#EEF2FF',
    agentMessage: '#F3F4F6',
  },
  position: 'right',
  compact: false,
  positionOffset: {
    x: 0,
    y: 0
  },
  labels: {
    welcomeTitle: 'Chat Support',
    welcomeSubtitle: 'We\'re here to help',
    askQuestionButton: 'Ask a question',
  },
  logo: null,
  launcherIcon: null,
};

// Create context with default values
const ThemeContext = createContext<ThemeContextType>({
  ...defaultTheme,
  updateTheme: () => {},
});

export const ThemeProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme);

  const updateTheme = (config: Partial<ThemeConfig>) => {
    setTheme(prevTheme => ({
      ...prevTheme,
      ...config,
      colors: {
        ...prevTheme.colors,
        ...(config.colors || {})
      },
      positionOffset: {
        ...prevTheme.positionOffset,
        ...(config.positionOffset || {})
      },
      labels: {
        ...prevTheme.labels,
        ...(config.labels || {})
      }
    }));
  };

  return (
    <ThemeContext.Provider
      value={{
        ...theme,
        updateTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);

export default ThemeContext;
