
import { Contact } from '@/types/contact';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import TicketList from '@/components/inbox/TicketList';
import { Ticket } from '@/types/ticket';

interface ContactTicketsProps {
  contact: Contact;
}

export const ContactTickets = ({ contact }: ContactTicketsProps) => {
  // Filter tickets for this contact from our mock data
  // In a real app, this would come from your backend
  const tickets: Ticket[] = [
    {
      id: '1',
      subject: 'Account Access Issue',
      customer: `${contact.firstName} ${contact.lastName}`,
      lastMessage: 'Having trouble logging in to my account',
      assignee: 'Sarah Wilson',
      company: contact.company || '',
      tags: ['account', 'urgent'],
      status: 'open' as const,
      priority: 'high' as const,
      createdAt: '2024-03-15T10:00:00Z',
      isUnread: true,
      hasNotification: true,
      notificationType: 'mention',
    },
    {
      id: '2',
      subject: 'Feature Request',
      customer: `${contact.firstName} ${contact.lastName}`,
      lastMessage: 'Would like to discuss new feature possibilities',
      assignee: null,
      company: contact.company || '',
      tags: ['feature-request'],
      status: 'pending' as const,
      priority: 'medium' as const,
      createdAt: '2024-03-14T15:30:00Z',
      isUnread: false,
    },
  ].filter(ticket => ticket.customer === `${contact.firstName} ${contact.lastName}`);

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-purple-100/50 shadow-lg shadow-purple-500/5">
      <CardHeader className="border-b border-purple-100/20 pb-4">
        <CardTitle className="text-lg font-semibold text-purple-900">Tickets</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="w-full">
          <TicketList tickets={tickets} />
        </div>
      </CardContent>
    </Card>
  );
};

