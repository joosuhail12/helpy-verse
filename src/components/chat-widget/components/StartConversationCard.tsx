
import React from 'react';
import { ArrowRight } from 'lucide-react';

interface StartConversationCardProps {
  onClick: () => void;
}

/**
 * Card component to start a new conversation
 */
const StartConversationCard = ({ onClick }: StartConversationCardProps) => {
  return (
    <div 
      onClick={onClick}
      className="cursor-pointer bg-white shadow-sm rounded-lg p-5 mb-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-indigo-900">Send us a message</h3>
          <p className="text-sm text-gray-500">We'll get back to you as soon as we can</p>
        </div>
        <div className="text-indigo-700">
          <ArrowRight className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

export default StartConversationCard;
