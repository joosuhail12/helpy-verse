
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';

interface ConversationHeaderProps {
  conversationId: string;
  onBack?: () => void;
}

/**
 * Header component for the conversation view
 */
const ConversationHeader: React.FC<ConversationHeaderProps> = ({ 
  conversationId,
  onBack 
}) => {
  const { theme } = useTheme();
  
  if (!onBack) return null;
  
  return (
    <div 
      className="px-4 py-3 border-b flex items-center gap-3 z-10 shadow-sm"
      style={{ 
        backgroundColor: theme.colors.headerBackground,
        color: theme.colors.headerText
      }}
    >
      <button 
        onClick={onBack} 
        className="hover:text-gray-300 p-1.5 hover:bg-gray-800 rounded-full transition-colors"
        style={{ color: theme.colors.headerText }}
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      <div>
        <h2 className="font-semibold" style={{ color: theme.colors.headerText }}>Conversation</h2>
        <p className="text-xs text-gray-400">Ticket #{conversationId.substring(0, 8)}</p>
      </div>
    </div>
  );
};

export default ConversationHeader;
