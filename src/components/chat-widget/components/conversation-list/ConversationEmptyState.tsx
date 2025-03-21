
import React from 'react';
import { MessageSquare, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConversationEmptyStateProps {
  onNewChat: () => void;
}

/**
 * Component displayed when there are no conversations
 */
const ConversationEmptyState = ({ onNewChat }: ConversationEmptyStateProps) => {
  return (
    <div className="flex flex-col h-full items-center justify-center p-6">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <MessageSquare className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-gray-800 font-semibold">No messages yet</h3>
      <p className="text-gray-500 text-center mt-2 mb-6 max-w-[250px]">
        Start your first conversation with our support team
      </p>
      <Button 
        onClick={onNewChat}
        className="bg-gray-900 hover:bg-gray-800 text-white"
      >
        Start a conversation
      </Button>
      <div className="mt-6 w-full">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Or search for an existing conversation"
            className="w-full border border-gray-200 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default ConversationEmptyState;
