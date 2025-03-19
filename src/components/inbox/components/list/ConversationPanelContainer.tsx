
import React, { memo } from 'react';
import ConversationPanel from '../../ConversationPanel';
import type { Ticket } from '@/types/ticket';

interface ConversationPanelContainerProps {
  selectedTicket: Ticket | null;
  onClose: () => void;
}

const ConversationPanelContainer = ({ selectedTicket, onClose }: ConversationPanelContainerProps) => {
  if (!selectedTicket) {
    return null;
  }

  return (
    <div className="hidden md:block flex-1 border-l border-gray-200 bg-gray-50">
      <ConversationPanel ticket={selectedTicket} onClose={onClose} />
    </div>
  );
};

export default memo(ConversationPanelContainer);
