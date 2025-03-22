
import React from 'react';
import { MessageSquare, X } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';

interface WidgetLauncherProps {
  toggleWidget: () => void;
  isOpen: boolean;
  position?: 'right' | 'left';
}

/**
 * Launcher button for the chat widget
 */
const WidgetLauncher: React.FC<WidgetLauncherProps> = ({ 
  toggleWidget, 
  isOpen,
  position = 'right'
}) => {
  const { theme } = useTheme();
  
  return (
    <button
      onClick={toggleWidget}
      className={`fixed bottom-5 ${position}-5 z-30 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ease-in-out`}
      style={{ 
        backgroundColor: theme.colors.launcherBackground,
        color: theme.colors.launcherText 
      }}
      aria-label={isOpen ? "Close chat" : "Open chat"}
    >
      {isOpen ? (
        <X className="h-6 w-6" />
      ) : (
        <MessageSquare className="h-6 w-6" />
      )}
    </button>
  );
};

export default WidgetLauncher;
