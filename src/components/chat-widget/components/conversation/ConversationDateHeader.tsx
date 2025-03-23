
import React from 'react';
import { Calendar } from 'lucide-react';

interface ConversationDateHeaderProps {
  date: string;
}

/**
 * Header displaying conversation date grouping
 */
const ConversationDateHeader = ({ date }: ConversationDateHeaderProps) => {
  return (
    <div className="sticky top-0 z-10 bg-gray-50 py-2 px-4 text-xs font-medium text-gray-600 border-b border-gray-100 flex items-center gap-1.5">
      <Calendar className="h-3 w-3" />
      {date}
    </div>
  );
};

export default ConversationDateHeader;
