
import * as React from 'react';

interface ThemeContextProps {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
}

const defaultThemeContext: ThemeContextProps = {
  primaryColor: '#7c3aed', // Default primary color
  setPrimaryColor: () => {}, // Placeholder function
};

export const ThemeContext = React.createContext<ThemeContextProps>(defaultThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [primaryColor, setPrimaryColor] = React.useState<string>('#7c3aed');

  const contextValue = React.useMemo(
    () => ({
      primaryColor,
      setPrimaryColor,
    }),
    [primaryColor]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
