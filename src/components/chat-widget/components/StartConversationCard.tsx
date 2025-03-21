
import React from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';

interface StartConversationCardProps {
  onClick: () => void;
}

/**
 * Card component to start a new conversation
 * Styled like Intercom's "Ask a question" button
 */
const StartConversationCard = ({ onClick }: StartConversationCardProps) => {
  return (
    <div 
      onClick={onClick}
      className="cursor-pointer bg-white hover:bg-gray-50 transition-colors duration-200 shadow-sm border border-gray-100 rounded-full p-4 mb-6 flex items-center justify-between"
    >
      <span className="font-medium text-gray-800 pl-2">Ask a question</span>
      <div className="bg-gray-900 text-white rounded-full h-8 w-8 flex items-center justify-center">
        <ArrowRight className="h-4 w-4" />
      </div>
    </div>
  );
};

export default StartConversationCard;
