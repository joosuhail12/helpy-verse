
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
    <div 
      className="flex justify-around py-2 px-2 border-t"
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
  );
};

export default Navigation;
