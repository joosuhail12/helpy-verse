
import React from 'react';
import { Home, MessageSquare } from 'lucide-react';
import { WidgetPage } from './types';
import { useTheme } from '../theme/ThemeContext';

interface NavigationBarProps {
  currentPage: WidgetPage;
  navigateTo: (page: WidgetPage) => void;
}

/**
 * Bottom navigation bar for the chat widget
 */
const NavigationBar: React.FC<NavigationBarProps> = ({ currentPage, navigateTo }) => {
  const { theme } = useTheme();
  
  const activeColor = theme.colors.primary;
  const inactiveColor = theme.colors.secondary;
  
  return (
    <div className="border-t border-gray-100 py-2 px-6 bg-white flex justify-around items-center">
      <button 
        onClick={() => navigateTo('home')}
        className="flex flex-col items-center gap-1"
        style={{ color: currentPage === 'home' ? activeColor : inactiveColor }}
        aria-label="Home"
      >
        <Home className="h-4 w-4" />
        <span className="text-xs">Home</span>
      </button>
      <button 
        onClick={() => navigateTo('conversations')}
        className="flex flex-col items-center gap-1"
        style={{ 
          color: (currentPage === 'conversations' || currentPage === 'conversation-detail') 
            ? activeColor 
            : inactiveColor 
        }}
        aria-label="Messages"
      >
        <MessageSquare className="h-4 w-4" />
        <span className="text-xs">Messages</span>
      </button>
    </div>
  );
};

export default NavigationBar;
