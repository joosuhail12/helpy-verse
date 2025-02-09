
import { Inbox, MessageSquare, Clock, Flag } from 'lucide-react';

interface Ticket {
  id: string;
  subject: string;
  customer: string;
  status: 'open' | 'closed' | 'pending';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

interface TicketListProps {
  tickets: Ticket[];
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

  return (
    <div className="space-y-3 animate-fade-in">
      {tickets.map((ticket) => (
        <div
          key={ticket.id}
          className="bg-white rounded-lg border border-purple-100 p-4 hover:shadow-md transition-all cursor-pointer w-full"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-full bg-purple-100/50 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-5 h-5 text-primary/70" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{ticket.subject}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span className="text-sm text-gray-600 truncate">{ticket.customer}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                  ticket.status === 'open' ? 'bg-green-50 text-green-700 border border-green-200' :
                  ticket.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                  'bg-gray-50 text-gray-700 border border-gray-200'
                }`}>
                  {ticket.status}
                </span>
                <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                  ticket.priority === 'high' ? 'bg-red-50 text-red-700 border border-red-200' :
                  ticket.priority === 'medium' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                  'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  {ticket.priority}
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                {new Date(ticket.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TicketList;

