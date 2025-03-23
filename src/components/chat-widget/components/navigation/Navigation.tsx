
import React from 'react';
import { Home, MessageSquare, HelpCircle, Newspaper } from 'lucide-react';

interface NavigationProps {
  activeView: 'home' | 'messages';
  setActiveView: (view: 'home' | 'messages') => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeView, setActiveView }) => {
  return (
    <div className="px-1 py-2 bg-black border-t border-gray-800 flex justify-around">
      <button
        onClick={() => setActiveView('home')}
        className={`flex flex-col items-center w-1/2 py-2 relative ${
          activeView === 'home' ? 'text-white' : 'text-gray-500'
        }`}
      >
        <div className="relative">
          <Home size={20} />
        </div>
        <span className="text-xs mt-1">Home</span>
      </button>
      
      <button
        onClick={() => setActiveView('messages')}
        className={`flex flex-col items-center w-1/2 py-2 relative ${
          activeView === 'messages' ? 'text-white' : 'text-gray-500'
        }`}
      >
        <div className="relative">
          <MessageSquare size={20} />
          {activeView !== 'messages' && (
            <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-white text-[10px]">
              1
            </span>
          )}
        </div>
        <span className="text-xs mt-1">Messages</span>
      </button>
    </div>
  );
};

export default Navigation;
