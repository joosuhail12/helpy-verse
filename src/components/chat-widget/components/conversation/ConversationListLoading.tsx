
import React from 'react';

/**
 * Loading state for conversation list
 */
const ConversationListLoading = () => {
  return (
    <div className="flex flex-col h-full items-center justify-center p-6">
      <div className="w-8 h-8 border-t-2 border-primary rounded-full animate-spin"></div>
      <p className="mt-4 text-sm text-gray-500 font-medium">Loading conversations...</p>
    </div>
  );
};

export default ConversationListLoading;
