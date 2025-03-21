
import React from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';

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
      className="cursor-pointer bg-white hover:bg-gray-50 transition-colors duration-200 shadow-sm border border-gray-100 rounded-lg p-5 mb-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-[#5DCFCF]/10 p-2 rounded-full">
            <MessageCircle className="h-5 w-5 text-[#5DCFCF]" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Send us a message</h3>
            <p className="text-sm text-gray-500">We typically reply within minutes</p>
          </div>
        </div>
        <div className="text-[#5DCFCF]">
          <ArrowRight className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};

export default StartConversationCard;
