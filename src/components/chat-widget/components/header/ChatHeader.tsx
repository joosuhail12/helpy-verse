
import React from 'react';
import { ChevronLeft, X } from 'lucide-react';
import { useThemeContext } from '@/context/ThemeContext';

interface ChatHeaderProps {
  title: string;
  onBackClick: (() => void) | null;
  onClose: (() => void) | null;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ title, onBackClick, onClose }) => {
  const { colors } = useThemeContext();
  
  return (
    <header 
      className="flex items-center justify-between p-4 border-b"
      style={{ 
        backgroundColor: colors.backgroundSecondary,
        borderColor: colors.border
      }}
    >
      <div className="flex items-center">
        {onBackClick && (
          <button 
            onClick={onBackClick}
            className="mr-2 p-1 rounded-full hover:bg-gray-200"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        <h3 className="font-medium">{title}</h3>
      </div>
      
      {onClose && (
        <button 
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-200"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </header>
  );
};

export default ChatHeader;
