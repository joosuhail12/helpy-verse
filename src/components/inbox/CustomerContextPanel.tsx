
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import type { Ticket } from "@/types/ticket";
import CustomerHeader from './components/CustomerHeader';
import OverviewSection from './components/OverviewSection';
import CustomerDetailsSection from './components/CustomerDetailsSection';
import CompanySection from './components/CompanySection';
import TimelineSection from './components/TimelineSection';

interface CustomerContextPanelProps {
  ticket: Ticket;
}

const CustomerContextPanel = ({ ticket }: CustomerContextPanelProps) => {
  const isLoading = false;

  const customerTimeline = [
    {
      id: '1',
      type: 'ticket' as const,
      description: 'Opened new ticket: Cannot access account',
      timestamp: '2024-03-10T10:00:00Z'
    },
    {
      id: '2',
      type: 'message' as const,
      description: 'Last message sent',
      timestamp: '2024-03-08T15:30:00Z'
    },
    {
      id: '3',
      type: 'feedback' as const,
      description: 'Left positive feedback on support interaction',
      timestamp: '2024-03-05T09:15:00Z',
      sentiment: 'positive' as const
    }
  ];

  const communicationChannels = [
    {
      type: 'email' as const,
      value: ticket.customer + '@example.com',
      isPreferred: true,
      lastUsed: '2024-03-15T10:00:00Z'
    },
    {
      type: 'phone' as const,
      value: '+1 (555) 123-4567',
      isPreferred: false,
      lastUsed: '2024-03-10T14:30:00Z'
    }
  ];

  return (
    <Card className="h-full flex flex-col bg-white border-l">
      <CustomerHeader ticket={ticket} />
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <OverviewSection ticket={ticket} />
          <CustomerDetailsSection 
            ticket={ticket}
            communicationChannels={communicationChannels}
            isLoading={isLoading}
          />
          <CompanySection ticket={ticket} />
          <TimelineSection 
            events={customerTimeline}
            isLoading={isLoading}
          />
        </div>
      </ScrollArea>
    </Card>
  );
};

export default CustomerContextPanel;
