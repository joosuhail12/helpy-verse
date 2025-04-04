
import React from 'react';
import { formatDistanceToNow } from 'date-fns';

interface ContactActivityBadgeProps {
  lastActivity: string;
}

export const ContactActivityBadge: React.FC<ContactActivityBadgeProps> = ({ lastActivity }) => {
  const getRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <span className="text-xs text-gray-500">
      {getRelativeTime(lastActivity)}
    </span>
  );
};
