
import ConversationPanel from '../../ConversationPanel';
import type { Ticket } from '@/types/ticket';

interface ConversationPanelContainerProps {
  selectedTicket: Ticket | null;
  onClose: () => void;
}

const ConversationPanelContainer = ({ selectedTicket, onClose }: ConversationPanelContainerProps) => {
  if (!selectedTicket) return null;

  return (
    <>
      <div className="hidden md:block md:flex-1 border-l bg-white">
        <ConversationPanel
          ticket={selectedTicket}
          onClose={onClose}
        />
      </div>

      {/* Mobile conversation panel */}
      <div className="fixed inset-0 z-50 md:hidden bg-white">
        <ConversationPanel
          ticket={selectedTicket}
          onClose={onClose}
        />
      </div>
    </>
  );
};

export default ConversationPanelContainer;
