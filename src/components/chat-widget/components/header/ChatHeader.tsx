
import React from 'react';
import { ChevronLeft, X } from 'lucide-react';
import AgentAvatarGroup from './AgentAvatarGroup';
import { useThemeContext } from '@/context/ThemeContext';

export interface ChatHeaderProps {
  title: string;
  subtitle?: string;
  agents?: string[];
  onBackClick?: () => void;
  showBackButton?: boolean;
  onClose?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  title,
  subtitle,
  agents = [],
  onBackClick,
  showBackButton = false,
  onClose
}) => {
  const { colors } = useThemeContext();
  
  return (
    <div 
      className="p-3 flex items-center border-b"
      style={{ 
        backgroundColor: colors.background,
        borderColor: colors.border
      }}
    >
      {(showBackButton || onBackClick) && (
        <button 
          onClick={onBackClick} 
          className="p-1 mr-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      
      <div className="flex-1 min-w-0">
        <h3 className="font-medium truncate" style={{ color: colors.foreground }}>
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs truncate text-gray-500">{subtitle}</p>
        )}
      </div>
      
      {agents && agents.length > 0 && (
        <div className="ml-2">
          <AgentAvatarGroup agents={agents} />
        </div>
      )}

      {onClose && (
        <button 
          onClick={onClose} 
          className="p-1 ml-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close chat"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default ChatHeader;
