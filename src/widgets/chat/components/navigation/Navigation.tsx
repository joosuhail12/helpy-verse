
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
    <div className="w-full">
      <div 
        className="flex justify-around py-2 px-2"
        style={{ borderColor: colors.border }}
      >
        <button
          onClick={() => setActiveView('home')}
          className={`p-2 rounded-md flex flex-col items-center ${
            activeView === 'home' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Home size={20} />
          <span className="text-xs mt-1">Home</span>
        </button>
        
        <button
          onClick={() => setActiveView('messages')}
          className={`p-2 rounded-md flex flex-col items-center ${
            activeView === 'messages' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <MessageSquare size={20} />
          <span className="text-xs mt-1">Messages</span>
        </button>
        
        <button
          onClick={() => setActiveView('conversation')}
          className={`p-2 rounded-md flex flex-col items-center ${
            activeView === 'conversation' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <User size={20} />
          <span className="text-xs mt-1">Account</span>
        </button>
      </div>
      
      {/* Powered By section */}
      <div className="bg-gray-50 py-2 px-4 text-center border-t text-xs text-gray-500 flex items-center justify-center" style={{ borderColor: colors.border }}>
        <span className="mr-1">Powered by</span>
        <div className="flex items-center">
          <img 
            src="https://framerusercontent.com/images/9N8Z1vTRbJsHlrIuTjm6Ajga4dI.png" 
            alt="Pullse Logo" 
            className="h-4 w-auto"
          />
          <span className="ml-1 font-medium">Pullse</span>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
