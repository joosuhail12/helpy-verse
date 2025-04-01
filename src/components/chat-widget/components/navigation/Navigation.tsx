
import React from 'react';
import { Home, MessageSquare } from 'lucide-react';
import { useThemeContext } from '@/context/ThemeContext';
import { View } from '../../container/ChatWidgetContainer';

interface NavigationProps {
  activeView: View;
  setActiveView: React.Dispatch<React.SetStateAction<View>>;
}

const Navigation: React.FC<NavigationProps> = ({ activeView, setActiveView }) => {
  const { colors } = useThemeContext();

  return (
    <>
      <div className="bg-white border-t flex justify-around py-2" style={{ borderColor: colors.border }}>
        <button
          onClick={() => setActiveView('home')}
          className={`flex flex-col items-center p-2 rounded-md transition-colors ${
            activeView === 'home' ? 'text-primary' : 'text-gray-500'
          }`}
          style={{ color: activeView === 'home' ? colors.primary : undefined }}
        >
          <Home size={20} />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button
          onClick={() => setActiveView('messages')}
          className={`flex flex-col items-center p-2 rounded-md transition-colors ${
            activeView === 'messages' || activeView === 'conversation' ? 'text-primary' : 'text-gray-500'
          }`}
          style={{ color: activeView === 'messages' || activeView === 'conversation' ? colors.primary : undefined }}
        >
          <MessageSquare size={20} />
          <span className="text-xs mt-1">Messages</span>
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
