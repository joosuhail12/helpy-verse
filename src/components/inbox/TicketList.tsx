
import { Inbox } from 'lucide-react';

interface TicketListProps {
  tickets?: any[]; // We'll define a proper type when implementing the actual ticket data
}

const TicketList = ({ tickets = [] }: TicketListProps) => {
  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] bg-white/50 backdrop-blur-sm rounded-lg border border-purple-100">
        <div className="text-center max-w-md mx-auto p-6 space-y-4">
          <div className="w-16 h-16 mx-auto bg-primary/5 rounded-full flex items-center justify-center">
            <Inbox className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">No tickets yet</h3>
          <p className="text-gray-500">
            When customers reach out for support, their tickets will appear here. You'll be able to manage and respond to them from this dashboard.
          </p>
        </div>
      </div>
    );
  }

  return null; // We'll implement the actual ticket list view later
};

export default TicketList;
