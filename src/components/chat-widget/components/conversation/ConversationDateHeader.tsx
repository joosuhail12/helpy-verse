
import React from 'react';

interface ConversationDateHeaderProps {
  date: string;
}

/**
 * Header displaying conversation date grouping
 */
const ConversationDateHeader = ({ date }: ConversationDateHeaderProps) => {
  return (
    <div className="text-center py-2 text-xs text-gray-500 border-b border-gray-100">
      {date}
    </div>
  );
};

export default ConversationDateHeader;
