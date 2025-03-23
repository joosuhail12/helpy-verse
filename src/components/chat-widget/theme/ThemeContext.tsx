
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
}

export interface ThemeConfig {
  colors: ThemeColors;
  borderRadius?: string;
  fontFamily?: string;
  logoUrl?: string;
  companyName?: string;
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
  },
  borderRadius: '1rem',
  fontFamily: 'Inter, system-ui, sans-serif',
  companyName: 'Support Chat'
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
    }
  });

  const updateTheme = (newTheme: Partial<ThemeConfig>) => {
    setTheme(prevTheme => ({
      ...prevTheme,
      ...newTheme,
      colors: {
        ...prevTheme.colors,
        ...(newTheme.colors || {}),
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
