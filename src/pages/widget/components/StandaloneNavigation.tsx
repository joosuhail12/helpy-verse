
import React from 'react';
import { Home, MessageSquare } from 'lucide-react';
import { WidgetPage } from '@/components/chat-widget/container/types';

interface StandaloneNavigationProps {
  currentPage: WidgetPage;
  navigateTo: (page: WidgetPage) => void;
}

/**
 * Navigation component for standalone widget mode
 */
const StandaloneNavigation: React.FC<StandaloneNavigationProps> = ({
  currentPage,
  navigateTo
}) => {
  return (
    <div className="border-t border-gray-100 py-2 px-6 bg-white flex justify-around items-center">
      <button 
        onClick={() => navigateTo('home')}
        className={`flex flex-col items-center gap-1`}
        aria-label="Home"
      >
        <Home className="h-4 w-4" />
        <span className="text-xs">Home</span>
      </button>
      <button 
        onClick={() => navigateTo('conversations')}
        className={`flex flex-col items-center gap-1`}
        aria-label="Messages"
      >
        <MessageSquare className="h-4 w-4" />
        <span className="text-xs">Messages</span>
      </button>
    </div>
  );
};

export default StandaloneNavigation;
