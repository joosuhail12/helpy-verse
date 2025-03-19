
import { Button } from "@/components/ui/button";
import { Plus, InboxIcon } from "lucide-react";

interface EmptyTicketStateProps {
  onCreateTicket: () => void;
}

const EmptyTicketState = ({ onCreateTicket }: EmptyTicketStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-16">
      <div className="bg-gray-50 p-6 rounded-full mb-6">
        <InboxIcon className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-medium mb-2">No tickets yet</h3>
      <p className="text-gray-500 mb-6 text-center max-w-md">
        Create your first ticket to start managing customer conversations.
      </p>
      <Button onClick={onCreateTicket}>
        <Plus className="h-4 w-4 mr-2" />
        Create Ticket
      </Button>
    </div>
  );
};

export default EmptyTicketState;
