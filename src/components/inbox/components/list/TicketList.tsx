
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Ticket } from '@/types/ticket';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import EmptyTicketState from '../../EmptyTicketState';

interface TicketListProps {
  tickets: Ticket[];
  isLoading?: boolean;
  onTicketCreated?: (ticket: Ticket) => void;
}

const TicketList = ({ tickets, isLoading, onTicketCreated }: TicketListProps) => {
  console.log('TicketList component rendering with', tickets.length, 'tickets');
  
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!tickets || tickets.length === 0) {
    return <EmptyTicketState onCreateTicket={onTicketCreated} />;
  }

  return (
    <ScrollArea className="h-full w-full px-4">
      <div className="space-y-4 py-4">
        {tickets.map((ticket) => (
          <Card key={ticket.id} className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-lg">{ticket.subject}</h3>
                <span className="text-xs bg-blue-100 text-blue-800 py-1 px-2 rounded-full">
                  {ticket.status}
                </span>
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <span className="font-medium">
                  {typeof ticket.customer === 'string' 
                    ? ticket.customer 
                    : ticket.customer.name}
                </span>
                <span className="mx-2">•</span>
                <span>
                  {typeof ticket.company === 'string'
                    ? ticket.company
                    : ticket.company?.name || 'No company'}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-2">
                {ticket.lastMessage}
              </p>
              
              <div className="flex justify-between items-center mt-2">
                <div className="flex space-x-2">
                  {ticket.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-gray-100 py-1 px-2 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(ticket.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default TicketList;
