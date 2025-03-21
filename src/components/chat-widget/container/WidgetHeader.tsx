
import React from 'react';
import { X, Home } from 'lucide-react';
import { WidgetHeaderProps } from './types';
import { useTheme } from '../theme/ThemeContext';

/**
 * Header component for the chat widget
 */
const WidgetHeader: React.FC<WidgetHeaderProps> = ({ 
  currentPage, 
  navigateTo, 
  toggleWidget 
}) => {
  const { theme } = useTheme();
  
  return (
    <div className="p-4 flex justify-between items-center border-b border-gray-100"
      style={{ 
        backgroundColor: theme.colors.headerBackground,
        color: theme.colors.headerText
      }}
    >
      <div className="flex items-center gap-2">
        {currentPage !== 'home' && (
          <button
            onClick={() => navigateTo('home')}
            className="p-1.5 rounded-full hover:bg-gray-100/20 text-gray-300"
          >
            <Home className="h-5 w-5" />
          </button>
        )}
        <h2 className="font-semibold">
          {currentPage === 'home' && (theme.companyName || 'Support Chat')}
          {currentPage === 'conversations' && 'Your Conversations'}
          {currentPage === 'new-chat' && 'New Conversation'}
          {currentPage === 'conversation-detail' && 'Chat'}
        </h2>
      </div>
      <button
        onClick={toggleWidget}
        className="p-1.5 rounded-full hover:bg-gray-100/20 text-gray-300"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

export default WidgetHeader;
