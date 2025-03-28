
import React from 'react';
import { Home, MessageSquare } from 'lucide-react';
import { useThemeContext } from '@/context/ThemeContext';
import { View } from '../../container/ChatWidgetContainer';

interface NavigationProps {
  activeView: View;
  setActiveView: React.Dispatch<React.SetStateAction<View>>;
}

const Navigation: React.FC<NavigationProps> = ({ activeView, setActiveView }) => {
  const { theme } = useThemeContext();

  return (
    <div className="bg-white border-t flex justify-around py-2" style={{ borderColor: theme.colors?.border }}>
      <button
        onClick={() => setActiveView('home')}
        className={`flex flex-col items-center p-2 rounded-md transition-colors ${
          activeView === 'home' ? 'text-primary' : 'text-gray-500'
        }`}
        style={{ color: activeView === 'home' ? theme.colors?.primary : undefined }}
      >
        <Home size={20} />
        <span className="text-xs mt-1">Home</span>
      </button>
      <button
        onClick={() => setActiveView('messages')}
        className={`flex flex-col items-center p-2 rounded-md transition-colors ${
          activeView === 'messages' || activeView === 'conversation' ? 'text-primary' : 'text-gray-500'
        }`}
        style={{ color: activeView === 'messages' || activeView === 'conversation' ? theme.colors?.primary : undefined }}
      >
        <MessageSquare size={20} />
        <span className="text-xs mt-1">Messages</span>
      </button>
    </div>
  );
};

export default Navigation;
