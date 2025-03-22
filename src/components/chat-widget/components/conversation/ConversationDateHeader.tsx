
import React from 'react';
import { Calendar } from 'lucide-react';
import { formatDateForScreenReader } from '@/utils/accessibility/a11yUtils';

interface ConversationDateHeaderProps {
  date: string;
}

/**
 * Header displaying conversation date grouping with accessibility improvements
 */
const ConversationDateHeader = ({ date }: ConversationDateHeaderProps) => {
  // For screen readers, we want to provide a more detailed date format
  const screenReaderDate = formatDateForScreenReader(new Date(date).toISOString());
  
  return (
    <div 
      className="sticky top-0 z-10 bg-gray-50 py-2 px-4 text-xs font-medium text-gray-600 border-b border-gray-100 flex items-center gap-1.5"
      role="separator"
      aria-label={`Messages from ${screenReaderDate}`}
    >
      <Calendar className="h-3 w-3" aria-hidden="true" />
      <span>{date}</span>
    </div>
  );
};

export default ConversationDateHeader;
