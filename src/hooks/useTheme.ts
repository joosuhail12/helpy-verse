
import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Run localStorage access in a try-catch to handle SSR environments
    try {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system')) {
        return storedTheme;
      }
      return 'system';
    } catch (error) {
      console.error('Failed to get theme from localStorage:', error);
      return 'system';
    }
  });

  useEffect(() => {
    try {
      const root = window.document.documentElement;
      
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
        
        root.classList.remove('light', 'dark');
        root.classList.add(systemTheme);
      } else {
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
      }
      
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.error('Failed to set theme:', error);
    }
  }, [theme]);

  return {
    theme,
    setTheme: (theme: Theme) => setThemeState(theme),
  };
}
