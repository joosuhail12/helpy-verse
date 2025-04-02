
import React from 'react';
import { X, ChevronLeft } from 'lucide-react';
import { useThemeContext } from '@/context/ThemeContext';

interface ChatHeaderProps {
  title: string;
  onBack?: () => void;
  onClose: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ title, onBack, onClose }) => {
  const { colors } = useThemeContext();
  
  return (
    <div 
      className="flex items-center justify-between p-4 border-b"
      style={{ borderColor: colors?.border || '#e5e7eb' }}
    >
      <div className="flex items-center">
        {onBack && (
          <button 
            onClick={onBack}
            className="mr-2 p-1 rounded-md hover:bg-gray-100 flex items-center justify-center"
            aria-label="Go back"
          >
            <ChevronLeft className="h-5 w-5 text-gray-500" />
          </button>
        )}
        <h2 className="font-medium text-base">{title}</h2>
      </div>
      
      <button 
        onClick={onClose}
        className="p-1 rounded-md hover:bg-gray-100 flex items-center justify-center"
        aria-label="Close chat"
      >
        <X className="h-5 w-5 text-gray-500" />
      </button>
    </div>
  );
};

export default ChatHeader;
