
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ThemeColors {
  primary: string;
  primaryForeground: string;
  background: string;
  foreground: string;
  border: string;
  userMessage: string;
  userMessageText: string;
  agentMessage: string;
  agentMessageText: string;
  inputBackground: string;
}

const defaultTheme: ThemeColors = {
  primary: '#9b87f5',
  primaryForeground: '#ffffff',
  background: '#ffffff',
  foreground: '#1A1F2C',
  border: '#e1e1e1',
  userMessage: '#9b87f5',
  userMessageText: '#ffffff',
  agentMessage: '#f1f1f1',
  agentMessageText: '#1A1F2C',
  inputBackground: '#f9f9f9',
};

interface ThemeContextType {
  colors: ThemeColors;
  setColors: (colors: Partial<ThemeColors>) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  colors: defaultTheme,
  setColors: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{
  children: ReactNode;
  initialColors?: Partial<ThemeColors>;
}> = ({ children, initialColors = {} }) => {
  const [colors, setColorsState] = useState<ThemeColors>({
    ...defaultTheme,
    ...initialColors,
  });

  const setColors = (newColors: Partial<ThemeColors>) => {
    setColorsState((prevColors) => ({
      ...prevColors,
      ...newColors,
    }));
  };

  return (
    <ThemeContext.Provider value={{ colors, setColors }}>
      {children}
    </ThemeContext.Provider>
  );
};
