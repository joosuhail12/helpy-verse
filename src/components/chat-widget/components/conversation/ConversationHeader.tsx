
import React from 'react';
import { ArrowLeft } from 'lucide-react';

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
  if (!onBack) return null;
  
  return (
    <div className="px-4 py-3 border-b flex items-center gap-3 bg-white z-10 shadow-sm">
      <button 
        onClick={onBack} 
        className="text-gray-500 hover:text-gray-700 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      <div>
        <h2 className="font-semibold text-gray-800">Conversation</h2>
        <p className="text-xs text-gray-500">Ticket #{conversationId.substring(0, 8)}</p>
      </div>
    </div>
  );
};

export default ConversationHeader;
