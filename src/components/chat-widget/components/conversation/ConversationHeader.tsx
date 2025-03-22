
import React from 'react';
import { ChevronLeft, Wifi, WifiOff } from 'lucide-react';

interface ConversationHeaderProps {
  conversationId: string;
  onBack: () => void;
  isConnected?: boolean;
}

/**
 * Header for conversation view with connection status indicator
 */
const ConversationHeader: React.FC<ConversationHeaderProps> = ({ 
  conversationId, 
  onBack,
  isConnected = true
}) => {
  return (
    <div className="bg-primary text-white p-4 flex items-center">
      <button 
        onClick={onBack}
        className="mr-2 rounded-full p-1 hover:bg-white/10 transition-colors"
        aria-label="Go back"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      
      <div className="flex-1">
        <h2 className="font-semibold text-lg">Support Chat</h2>
        <div className="text-xs text-white/80">
          {conversationId.startsWith('conv-') 
            ? 'Support conversation' 
            : `Conversation ID: ${conversationId}`}
        </div>
      </div>
      
      <div className="flex items-center text-xs text-white/80">
        {isConnected ? (
          <div className="flex items-center text-green-300">
            <Wifi className="h-4 w-4 mr-1" />
            <span>Connected</span>
          </div>
        ) : (
          <div className="flex items-center text-yellow-300">
            <WifiOff className="h-4 w-4 mr-1" />
            <span>Connecting...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationHeader;
