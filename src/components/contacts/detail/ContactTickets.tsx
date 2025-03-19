
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Inbox } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface Ticket {
  id: string;
  subject: string;
  status: string;
  priority: string;
  createdAt: string;
  company?: string;
  tags?: string[];
}

interface ContactTicketsProps {
  contactId: string;
  contactName: string;
}

export const ContactTickets = ({ contactId, contactName }: ContactTicketsProps) => {
  const navigate = useNavigate();
  
  // Pretend we fetched tickets
  const tickets: Ticket[] = [
    {
      id: '1',
      subject: 'Need help with account setup',
      status: 'open',
      priority: 'high',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      tags: ['onboarding', 'account']
    },
    {
      id: '2',
      subject: 'Product activation failed',
      status: 'closed',
      priority: 'medium',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      tags: ['activation', 'product']
    }
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Support Tickets</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/home/inbox/new?contactId=${contactId}`)}
        >
          <Inbox className="mr-2 h-4 w-4" />
          New Ticket
        </Button>
      </CardHeader>
      <CardContent>
        {tickets.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No tickets found for {contactName}
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="border rounded-md p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium hover:text-blue-600 cursor-pointer" 
                         onClick={() => navigate(`/home/inbox/ticket/${ticket.id}`)}>
                      {ticket.subject}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={ticket.status === 'open' ? 'default' : 'secondary'}
                    >
                      {ticket.status}
                    </Badge>
                    <Badge 
                      variant={
                        ticket.priority === 'high' ? 'destructive' : 
                        ticket.priority === 'medium' ? 'default' : 'secondary'
                      }
                    >
                      {ticket.priority}
                    </Badge>
                  </div>
                </div>
                {ticket.tags && ticket.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {ticket.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
