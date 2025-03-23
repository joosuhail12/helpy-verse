
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Ticket as TicketType } from "@/types/ticket";
import { useState } from "react";
import CustomerHeader from './components/CustomerHeader';
import CurrentTicketCard from './components/CurrentTicketCard';
import ContactInfoCard from './components/ContactInfoCard';
import CompanyInfoCard from './components/CompanyInfoCard';
import TimelineCard from './components/TimelineCard';
import CustomObjectCard from './components/CustomObjectCard';
import { useIsMobile } from '@/hooks/use-mobile';

interface CustomerContextPanelProps {
  ticket: TicketType;
}

const CustomerContextPanel = ({ ticket }: CustomerContextPanelProps) => {
  const isLoading = false;
  const isMobile = useIsMobile();
  const [openSections, setOpenSections] = useState({
    ticket: true,
    contact: true,
    company: true,
    timeline: false,
    customObject: true // Set to true by default to show the custom object data
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const customerTimeline = [
    {
      id: '1',
      type: 'ticket' as const,
      description: 'Opened new ticket: Cannot access account',
      timestamp: '2024-03-10T10:00:00Z'
    },
    {
      id: '2',
      type: 'purchase' as const,
      description: 'Purchased Premium Plan',
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

  return (
    <div className="h-full flex flex-col bg-white border-l transition-all duration-300 ease-in-out">
      <CustomerHeader customer={ticket.customer} company={ticket.company || ''} />
      
      <ScrollArea className={`flex-1 ${isMobile ? 'px-3 py-4' : 'p-4'}`}>
        <div className={`space-y-${isMobile ? '3' : '4'}`}>
          <CurrentTicketCard
            ticket={ticket}
            isOpen={openSections.ticket}
            onToggle={() => toggleSection('ticket')}
          />
          
          <ContactInfoCard
            customer={ticket.customer}
            company={ticket.company || ''}
            isOpen={openSections.contact}
            onToggle={() => toggleSection('contact')}
          />
          
          <CompanyInfoCard
            company={ticket.company || ''}
            isOpen={openSections.company}
            onToggle={() => toggleSection('company')}
          />
          
          <CustomObjectCard
            customerId={ticket.customer}
            ticketId={ticket.id}
            isOpen={openSections.customObject}
            onToggle={() => toggleSection('customObject')}
          />
          
          <TimelineCard
            events={customerTimeline}
            isLoading={isLoading}
            isOpen={openSections.timeline}
            onToggle={() => toggleSection('timeline')}
          />
        </div>
      </ScrollArea>
    </div>
  );
};

export default CustomerContextPanel;
