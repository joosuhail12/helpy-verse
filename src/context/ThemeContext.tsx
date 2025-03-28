
import React, { createContext, useState, useContext } from 'react';

export interface ThemeConfig {
  position?: 'left' | 'right';
  compact?: boolean;
  colors?: {
    primary?: string;
    background?: string;
    backgroundSecondary?: string;
    foreground?: string;
    border?: string;
    userMessage?: string;
    userMessageText?: string;
    agentMessage?: string;
    agentMessageText?: string;
    inputBackground?: string;
  };
  typography?: {
    fontFamily?: string;
    fontSize?: {
      small?: string;
      medium?: string;
      large?: string;
    };
  };
  layout?: {
    borderRadius?: {
      small?: string;
      medium?: string;
      large?: string;
    };
    spacing?: {
      small?: string;
      medium?: string;
      large?: string;
    };
  };
}

interface ThemeContextType {
  theme: ThemeConfig;
  setTheme: (theme: ThemeConfig) => void;
}

const defaultTheme: ThemeConfig = {
  position: 'right',
  compact: false,
  colors: {
    primary: '#9b87f5',
    background: '#ffffff',
    backgroundSecondary: '#f9f9f9',
    foreground: '#1A1F2C',
    border: '#eaeaea',
    userMessage: '#9b87f5',
    userMessageText: '#ffffff',
    agentMessage: '#f1f1f1',
    agentMessageText: '#1A1F2C',
    inputBackground: '#ffffff',
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
    fontSize: {
      small: '12px',
      medium: '14px',
      large: '16px',
    },
  },
  layout: {
    borderRadius: {
      small: '4px',
      medium: '8px',
      large: '12px',
    },
    spacing: {
      small: '4px',
      medium: '8px',
      large: '16px',
    },
  },
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{
  children: React.ReactNode;
  initialTheme?: Partial<ThemeConfig>;
}> = ({ children, initialTheme = {} }) => {
  const [theme, setTheme] = useState<ThemeConfig>({ ...defaultTheme, ...initialTheme });

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
