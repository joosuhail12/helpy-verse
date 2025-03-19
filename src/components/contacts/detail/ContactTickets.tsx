
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ticket } from '@/types/ticket';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

export interface ContactTicketsProps {
  contactId: string;
  contactName: string;
}

export const ContactTickets: React.FC<ContactTicketsProps> = ({ 
  contactId,
  contactName
}) => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate fetching tickets data
    const fetchTickets = async () => {
      setLoading(true);
      
      // This would be replaced with an actual API call
      const mockTickets: Ticket[] = [
        {
          id: '1',
          subject: 'Account access issue',
          customer: contactName,
          lastMessage: 'I cannot login to my account since yesterday.',
          assignee: 'Jane Smith',
          company: 'Acme Corp',
          tags: ['login', 'urgent'],
          status: 'open',
          priority: 'high',
          createdAt: new Date().toISOString(),
          isUnread: true,
          hasNotification: true,
          notificationType: 'mention'
        }
      ];
      
      setTimeout(() => {
        setTickets(mockTickets);
        setLoading(false);
      }, 500);
    };
    
    fetchTickets();
  }, [contactId, contactName]);
  
  const handleCreateTicket = () => {
    navigate('/home/tickets/new', { 
      state: { contactId, contactName } 
    });
  };
  
  const handleViewTicket = (ticketId: string) => {
    navigate(`/home/tickets/${ticketId}`);
  };
  
  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-md">Tickets</CardTitle>
        <Button size="sm" onClick={handleCreateTicket}>
          <Plus className="h-4 w-4 mr-2" />
          New Ticket
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-14 bg-muted rounded"></div>
            <div className="h-14 bg-muted rounded"></div>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>No tickets yet</p>
            <Button variant="link" onClick={handleCreateTicket}>
              Create a new ticket
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {tickets.map(ticket => (
              <div
                key={ticket.id}
                className="flex justify-between items-start p-3 border rounded hover:bg-muted cursor-pointer"
                onClick={() => handleViewTicket(ticket.id)}
              >
                <div>
                  <div className="font-medium">{ticket.subject}</div>
                  <div className="text-sm text-muted-foreground">
                    #{ticket.id} • {ticket.status} • {ticket.priority} priority
                  </div>
                </div>
              </div>
            ))}
            
            {tickets.length > 0 && (
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => navigate('/home/tickets', { state: { contactFilter: contactId } })}
              >
                View all tickets
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
