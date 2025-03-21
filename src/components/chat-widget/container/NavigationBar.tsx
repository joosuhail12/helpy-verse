
import React from 'react';
import { Home, MessageSquare } from 'lucide-react';
import { NavigationBarProps } from './types';

/**
 * Bottom navigation bar for the chat widget
 */
const NavigationBar: React.FC<NavigationBarProps> = ({ 
  currentPage, 
  navigateTo 
}) => {
  return (
    <div className="border-t border-gray-100 py-2 px-6 bg-white flex justify-around items-center">
      <button 
        onClick={() => navigateTo('home')}
        className={`flex flex-col items-center gap-1 ${
          currentPage === 'home' 
            ? 'text-[#5DCFCF]' 
            : 'text-gray-500'}`}
        aria-label="Home"
      >
        <Home className="h-4 w-4" />
        <span className="text-xs">Home</span>
      </button>
      <button 
        onClick={() => navigateTo('conversations')}
        className={`flex flex-col items-center gap-1 ${
          (currentPage === 'conversations' || currentPage === 'conversation-detail')
            ? 'text-[#5DCFCF]' 
            : 'text-gray-500'}`}
        aria-label="Messages"
      >
        <MessageSquare className="h-4 w-4" />
        <span className="text-xs">Messages</span>
      </button>
    </div>
  );
};

export default NavigationBar;
