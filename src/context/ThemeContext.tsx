
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ThemeContextType {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  secondaryColor: string;
  setSecondaryColor: (color: string) => void;
  fontSize: string;
  setFontSize: (size: string) => void;
  fontFamily: string;
  setFontFamily: (font: string) => void;
}

const defaultThemeContext: ThemeContextType = {
  primaryColor: '#7c3aed', // Default primary color (purple)
  setPrimaryColor: () => {},
  secondaryColor: '#e5e7eb', // Default secondary color (gray)
  setSecondaryColor: () => {},
  fontSize: 'medium',
  setFontSize: () => {},
  fontFamily: 'Inter, system-ui, sans-serif',
  setFontFamily: () => {},
};

export const ThemeContext = createContext<ThemeContextType>(defaultThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: Partial<Omit<ThemeContextType, 'setPrimaryColor' | 'setSecondaryColor' | 'setFontSize' | 'setFontFamily'>>;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children,
  initialTheme = {} 
}) => {
  const [primaryColor, setPrimaryColor] = useState(initialTheme.primaryColor || defaultThemeContext.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(initialTheme.secondaryColor || defaultThemeContext.secondaryColor);
  const [fontSize, setFontSize] = useState(initialTheme.fontSize || defaultThemeContext.fontSize);
  const [fontFamily, setFontFamily] = useState(initialTheme.fontFamily || defaultThemeContext.fontFamily);

  return (
    <ThemeContext.Provider value={{
      primaryColor,
      setPrimaryColor,
      secondaryColor,
      setSecondaryColor,
      fontSize,
      setFontSize,
      fontFamily,
      setFontFamily
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;
