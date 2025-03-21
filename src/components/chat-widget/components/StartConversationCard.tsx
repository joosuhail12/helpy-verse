
import React from 'react';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface StartConversationCardProps {
  onClick: () => void;
}

/**
 * Card component to start a new conversation
 */
const StartConversationCard = ({ onClick }: StartConversationCardProps) => {
  return (
    <Card 
      onClick={onClick}
      className="cursor-pointer group transition-all hover:shadow-md border-0 bg-white shadow-sm mb-4 overflow-hidden rounded-xl"
    >
      <div className="flex items-center gap-4 p-5">
        <div className="bg-gradient-to-br from-primary to-primary/90 p-3 rounded-full text-white">
          <MessageSquare className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-800 flex items-center gap-1.5">
            Start a conversation
            <ArrowRight className="h-3.5 w-3.5 text-primary opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
          </h3>
          <p className="text-sm text-gray-500">Get help from our support team</p>
        </div>
      </div>
    </Card>
  );
};

export default StartConversationCard;
