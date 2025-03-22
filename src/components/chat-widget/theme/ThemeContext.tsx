
import React, { createContext, useContext } from 'react';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  headerBackground: string;
  headerText: string;
  launcherBackground: string;
  launcherText: string;
  messageUserBackground: string;
  messageUserText: string;
  messageAgentBackground: string;
  messageAgentText: string;
  errorBackground: string;
  errorText: string;
  warningBackground: string;
  warningText: string;
}

export interface ThemeConfig {
  colors: ThemeColors;
  borderRadius?: string;
  fontFamily?: string;
  logoUrl?: string;
  companyName?: string;
  animation?: {
    enabled: boolean;
    duration: string;
  };
  shadows?: {
    widget: string;
    launcher: string;
    message: string;
  };
}

// Default theme inspired by Intercom
const defaultTheme: ThemeConfig = {
  colors: {
    primary: '#1f2937', // Dark gray
    secondary: '#4b5563', 
    accent: '#9b87f5', // Purple accent
    background: '#ffffff',
    text: '#374151',
    headerBackground: '#1f2937',
    headerText: '#ffffff',
    launcherBackground: '#1f2937',
    launcherText: '#ffffff',
    messageUserBackground: '#f3f4f6',
    messageUserText: '#1f2937',
    messageAgentBackground: '#1f2937',
    messageAgentText: '#ffffff',
    errorBackground: '#fee2e2',
    errorText: '#ef4444',
    warningBackground: '#fef3c7',
    warningText: '#f59e0b',
  },
  borderRadius: '1rem',
  fontFamily: 'Inter, system-ui, sans-serif',
  companyName: 'Support Chat',
  animation: {
    enabled: true,
    duration: '300ms',
  },
  shadows: {
    widget: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    launcher: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    message: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  }
};

interface ThemeContextType {
  theme: ThemeConfig;
  updateTheme: (newTheme: Partial<ThemeConfig>) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  updateTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  initialTheme?: Partial<ThemeConfig>;
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  initialTheme = {}, 
  children 
}) => {
  const [theme, setTheme] = React.useState<ThemeConfig>({
    ...defaultTheme,
    ...initialTheme,
    colors: {
      ...defaultTheme.colors,
      ...(initialTheme.colors || {}),
    },
    animation: {
      ...defaultTheme.animation,
      ...(initialTheme.animation || {}),
    },
    shadows: {
      ...defaultTheme.shadows,
      ...(initialTheme.shadows || {}),
    }
  });

  const updateTheme = (newTheme: Partial<ThemeConfig>) => {
    setTheme(prevTheme => ({
      ...prevTheme,
      ...newTheme,
      colors: {
        ...prevTheme.colors,
        ...(newTheme.colors || {}),
      },
      animation: {
        ...prevTheme.animation,
        ...(newTheme.animation || {}),
      },
      shadows: {
        ...prevTheme.shadows,
        ...(newTheme.shadows || {}),
      }
    }));
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
