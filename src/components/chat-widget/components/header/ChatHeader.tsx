
import React from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { useThemeContext } from '@/context/ThemeContext';

export interface ChatHeaderProps {
  title: string;
  onBackClick?: () => void;
  onClose?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ title, onBackClick, onClose }) => {
  const { colors } = useThemeContext();

  return (
    <div className="p-4 border-b flex items-center space-x-3" 
      style={{ borderColor: colors.border, backgroundColor: colors.background, color: colors.foreground }}>
      {onBackClick && (
        <button 
          onClick={onBackClick}
          className="rounded-full p-1 hover:bg-gray-100 transition-colors"
          style={{ color: colors.foreground }}
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
      )}
      <h2 className="font-medium flex-1 truncate">{title}</h2>
      {onClose && (
        <button
          onClick={onClose}
          className="rounded-full p-1 hover:bg-gray-100 transition-colors"
          style={{ color: colors.foreground }}
          aria-label="Close chat"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};

export default ChatHeader;
