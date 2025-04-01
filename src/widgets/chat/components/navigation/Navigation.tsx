
import React from 'react';
import { Home, MessageSquare, User } from 'lucide-react';
import { useThemeContext } from '@/context/ThemeContext';
import { View } from '../../types';

interface NavigationProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeView, setActiveView }) => {
  const { colors } = useThemeContext();
  
  return (
    <>
      <div 
        className="flex justify-around border-t py-2 px-2" 
        style={{ borderColor: colors.border }}
      >
        <button
          onClick={() => setActiveView('home')}
          className={`p-2 rounded-md flex items-center justify-center ${
            activeView === 'home' ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Home size={20} />
        </button>
        
        <button
          onClick={() => setActiveView('messages')}
          className={`p-2 rounded-md flex items-center justify-center ${
            activeView === 'messages' ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <MessageSquare size={20} />
        </button>
        
        <button
          onClick={() => setActiveView('conversation')}
          className={`p-2 rounded-md flex items-center justify-center ${
            activeView === 'conversation' ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <User size={20} />
        </button>
      </div>
      
      {/* Powered By section */}
      <div className="bg-gray-50 py-2 px-4 text-center border-t text-xs text-gray-500 flex items-center justify-center" style={{ borderColor: colors.border }}>
        <span className="mr-1">Powered by</span>
        <div className="bg-white rounded-md p-1 shadow-sm">
          <div className="w-4 h-4 bg-primary rounded-sm"></div>
        </div>
        <span className="ml-1 font-medium">Your Brand</span>
      </div>
    </>
  );
};

export default Navigation;
