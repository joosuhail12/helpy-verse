
import React from 'react';
import { Home, MessageSquare } from 'lucide-react';
import { useThemeContext } from '@/context/ThemeContext';

interface NavigationProps {
  activeView: 'home' | 'messages';
  setActiveView: (view: 'home' | 'messages') => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeView, setActiveView }) => {
  const { colors } = useThemeContext();
  
  return (
    <div className="flex justify-between border-t border-gray-200" 
      style={{ borderColor: colors.border }}>
      <button
        className={`flex flex-col items-center justify-center py-3 flex-1 ${
          activeView === 'home' ? 'text-primary' : 'text-gray-500'
        }`}
        onClick={() => setActiveView('home')}
        style={{ 
          color: activeView === 'home' ? colors.primary : `${colors.foreground}88`
        }}
      >
        <Home size={20} />
        <span className="text-xs mt-1">Home</span>
      </button>
      
      <button
        className={`flex flex-col items-center justify-center py-3 flex-1 ${
          activeView === 'messages' ? 'text-primary' : 'text-gray-500'
        }`}
        onClick={() => setActiveView('messages')}
        style={{ 
          color: activeView === 'messages' ? colors.primary : `${colors.foreground}88`
        }}
      >
        <MessageSquare size={20} />
        <span className="text-xs mt-1">Messages</span>
      </button>
    </div>
  );
};

export default Navigation;
