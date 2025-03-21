
import React from 'react';
import { X, Home } from 'lucide-react';
import { WidgetHeaderProps } from './types';

/**
 * Header component for the chat widget
 */
const WidgetHeader: React.FC<WidgetHeaderProps> = ({ 
  currentPage, 
  navigateTo, 
  toggleWidget 
}) => {
  return (
    <div className="p-4 flex justify-between items-center border-b border-gray-100">
      <div className="flex items-center gap-2">
        {currentPage !== 'home' && (
          <button
            onClick={() => navigateTo('home')}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500"
          >
            <Home className="h-5 w-5" />
          </button>
        )}
        <h2 className="font-semibold">
          {currentPage === 'home' && 'Support Chat'}
          {currentPage === 'conversations' && 'Your Conversations'}
          {currentPage === 'new-chat' && 'New Conversation'}
          {currentPage === 'conversation-detail' && 'Chat'}
        </h2>
      </div>
      <button
        onClick={toggleWidget}
        className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

export default WidgetHeader;
