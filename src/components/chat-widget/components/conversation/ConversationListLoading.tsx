
import React from 'react';

/**
 * Loading state for conversation list
 */
const ConversationListLoading = () => {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b border-gray-100">
        <div className="h-10 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
      
      <div className="p-2 bg-gray-50">
        <div className="h-5 w-24 mx-auto bg-gray-200 rounded animate-pulse"></div>
      </div>
      
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="border-b border-gray-100 p-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-3 w-12 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConversationListLoading;
