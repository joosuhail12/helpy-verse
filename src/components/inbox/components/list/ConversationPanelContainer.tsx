
import { Ticket } from '@/types/ticket';
import ConversationPanel from '../../ConversationPanel';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

interface ConversationPanelContainerProps {
  selectedTicket: Ticket | null;
  onClose: () => void;
}

const ConversationPanelContainer = ({ 
  selectedTicket, 
  onClose 
}: ConversationPanelContainerProps) => {
  if (!selectedTicket) return null;

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-white">
      <div className="md:hidden flex-none sticky top-0 z-10 p-2 bg-white border-b">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
          className="flex items-center"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to tickets
        </Button>
      </div>
      <div className="flex-1 overflow-hidden">
        <ConversationPanel ticket={selectedTicket} onClose={onClose} />
      </div>
    </div>
  );
};

export default ConversationPanelContainer;
