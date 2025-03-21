
import React from 'react';
import { X, ArrowLeft, Search } from 'lucide-react';
import { WidgetPage } from '@/components/chat-widget/container/types';

interface StandaloneHeaderProps {
  currentPage: WidgetPage;
  navigateTo: (page: WidgetPage) => void;
  closeWidget: () => void;
}

/**
 * Header component for standalone widget mode
 */
const StandaloneHeader: React.FC<StandaloneHeaderProps> = ({
  currentPage,
  navigateTo,
  closeWidget
}) => {
  if (currentPage === 'home') {
    return (
      <div className="absolute top-4 left-4">
        <div className="w-8 h-8 bg-black/20 rounded-full"></div>
      </div>
    );
  }
  
  if (currentPage === 'conversations') {
    return (
      <div className="p-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigateTo('home')} 
            className="text-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h2 className="font-semibold text-sm">Messages</h2>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-gray-700">
            <Search className="h-4 w-4" />
          </button>
          <button onClick={closeWidget} className="text-gray-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }
  
  // For conversation-detail and new-chat, return null as they manage their own headers
  return null;
};

export default StandaloneHeader;
