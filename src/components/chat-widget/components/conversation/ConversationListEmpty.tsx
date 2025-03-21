
import React from 'react';
import { Search } from 'lucide-react';

/**
 * Component displayed when there are no conversations
 */
const ConversationListEmpty = () => {
  return (
    <div className="flex flex-col h-full items-center justify-center p-6">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Search className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-gray-800 font-semibold">No messages yet</h3>
      <p className="text-gray-500 text-center mt-2 mb-6 max-w-[250px]">
        Start your first conversation with our support team
      </p>
      <input
        type="text"
        placeholder="Type or hum what your looking for"
        className="w-full border-t border-b border-gray-200 py-3 px-4 text-sm focus:outline-none"
      />
    </div>
  );
};

export default ConversationListEmpty;
