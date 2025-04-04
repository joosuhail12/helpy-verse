
import React from 'react';
import { Ticket } from '@/types/ticket';
import { Loader2 } from 'lucide-react';
import ViewToggle from './ViewToggle';
import { useState } from 'react';
import { ViewMode } from '@/types/ticket';

interface TicketListProps {
  tickets: Ticket[];
  isLoading?: boolean;
  onTicketCreated?: (ticket: Ticket) => void;
}

const TicketList: React.FC<TicketListProps> = ({ tickets, isLoading, onTicketCreated }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-4">
        <div className="text-center">
          <h3 className="text-lg font-medium">No tickets found</h3>
          <p className="text-sm text-muted-foreground mt-2">
            There are no tickets to display in this view.
          </p>
          <button
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            onClick={() => {
              if (onTicketCreated) {
                // Create a simple example ticket for demonstration
                const newTicket: Ticket = {
                  id: Math.random().toString(36).substring(7),
                  subject: 'New ticket',
                  customer: 'New Customer',
                  lastMessage: 'This is a new ticket created for demonstration.',
                  assignee: null,
                  tags: [],
                  status: 'open',
                  priority: 'medium',
                  createdAt: new Date().toISOString(),
                  isUnread: true,
                  recipients: ['example@example.com']
                };
                onTicketCreated(newTicket);
              }
            }}
          >
            Create a ticket
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-3 border-b">
        <div>
          <span className="text-sm font-medium">{tickets.length} tickets</span>
        </div>
        <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
      </div>
      
      <div className="overflow-auto flex-1">
        <ul className="divide-y">
          {tickets.map((ticket) => (
            <li key={ticket.id} className="p-4 hover:bg-gray-50 cursor-pointer">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">{ticket.subject}</h3>
                  <p className="text-sm text-gray-500 truncate">{ticket.lastMessage}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    ticket.priority === 'high' ? 'bg-red-100 text-red-800' :
                    ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {ticket.priority}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TicketList;
