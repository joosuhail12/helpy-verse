
import React from 'react';
import { Home, MessageSquare, HelpCircle, Rss } from 'lucide-react';
import { NavigationBarProps } from './types';

/**
 * Bottom navigation bar for the chat widget
 * Styled like Intercom's bottom navigation
 */
const NavigationBar: React.FC<NavigationBarProps> = ({ 
  currentPage, 
  navigateTo 
}) => {
  return (
    <div className="border-t border-gray-100 py-3 bg-white grid grid-cols-4 items-center">
      <button 
        onClick={() => navigateTo('home')}
        className={`flex flex-col items-center gap-1 ${
          currentPage === 'home' 
            ? 'text-gray-900' 
            : 'text-gray-500'}`}
        aria-label="Home"
      >
        <Home className="h-5 w-5" />
        <span className="text-xs">Home</span>
      </button>
      
      <button 
        onClick={() => navigateTo('conversations')}
        className={`flex flex-col items-center gap-1 ${
          (currentPage === 'conversations' || currentPage === 'conversation-detail')
            ? 'text-gray-900' 
            : 'text-gray-500'}`}
        aria-label="Messages"
      >
        <MessageSquare className="h-5 w-5" />
        <span className="text-xs">Messages</span>
      </button>
      
      <button 
        className="flex flex-col items-center gap-1 text-gray-500"
        aria-label="Help"
      >
        <HelpCircle className="h-5 w-5" />
        <span className="text-xs">Help</span>
      </button>
      
      <button 
        className="flex flex-col items-center gap-1 text-gray-500"
        aria-label="News"
      >
        <Rss className="h-5 w-5" />
        <span className="text-xs">News</span>
      </button>
    </div>
  );
};

export default NavigationBar;
