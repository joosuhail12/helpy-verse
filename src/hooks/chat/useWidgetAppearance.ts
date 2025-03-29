
import { useState, useEffect } from 'react';
import { useThemeContext } from '@/context/ThemeContext';
import { ChatWidgetSettings } from '@/store/slices/chatWidgetSettings/types';

interface WidgetAppearanceOptions {
  initialSettings?: Partial<ChatWidgetSettings>;
}

/**
 * Hook for managing chat widget appearance settings
 */
export const useWidgetAppearance = (options: WidgetAppearanceOptions = {}) => {
  const { colors, setColors, position, setPosition, compact, setCompact } = useThemeContext();
  const [isOpen, setIsOpen] = useState(false);
  
  // Apply initial settings if provided
  useEffect(() => {
    if (options.initialSettings) {
      if (options.initialSettings.primaryColor) {
        setColors({ 
          ...colors, 
          primary: options.initialSettings.primaryColor 
        });
      }
      
      if (options.initialSettings.position) {
        setPosition(options.initialSettings.position);
      }
      
      if (options.initialSettings.compact !== undefined) {
        setCompact(options.initialSettings.compact);
      }
    }
  }, [options.initialSettings]);
  
  const toggleWidget = () => {
    setIsOpen(prev => !prev);
  };
  
  const closeWidget = () => {
    setIsOpen(false);
  };
  
  const openWidget = () => {
    setIsOpen(true);
  };
  
  return {
    isOpen,
    position,
    compact,
    colors,
    toggleWidget,
    closeWidget,
    openWidget
  };
};
