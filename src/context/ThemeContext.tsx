
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
  position?: 'left' | 'right';
  compact?: boolean;
}

const defaultTheme: ThemeConfig = {
  colors: {
    primary: '#9b87f5',
    primaryForeground: '#ffffff',
    background: '#ffffff',
    backgroundSecondary: '#f8f9fa',
    foreground: '#333333',
    border: '#e2e8f0',
    userMessage: '#9b87f5',
    userMessageText: '#ffffff',
    agentMessage: '#f1f0fb',
    agentMessageText: '#1A1F2C',
    inputBackground: '#f8f9fa',
  }
};

interface ThemeContextType {
  colors: ThemeConfig['colors'];
  position: 'left' | 'right';
  compact: boolean;
  updateTheme: (theme: Partial<ThemeConfig>) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  colors: defaultTheme.colors,
  position: 'right',
  compact: false,
  updateTheme: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

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
    }
  });

  const updateTheme = (newTheme: Partial<ThemeConfig>) => {
    setTheme(prevTheme => ({
      ...prevTheme,
      ...newTheme,
      colors: {
        ...prevTheme.colors,
        ...(newTheme.colors || {})
      }
    }));
  };

  return (
    <ThemeContext.Provider
      value={{
        colors: theme.colors,
        position: theme.position || 'right',
        compact: theme.compact || false,
        updateTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
