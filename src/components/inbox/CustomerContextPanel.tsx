
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import type { Ticket as TicketType } from "@/types/ticket";
import { useState, useEffect } from "react";
import CustomerHeader from './components/CustomerHeader';
import CurrentTicketCard from './components/CurrentTicketCard';
import ContactInfoCard from './components/ContactInfoCard';
import CompanyInfoCard from './components/CompanyInfoCard';
import TimelineCard from './components/TimelineCard';
import { useCustomerRealtime, CustomerUpdate } from "./hooks/useCustomerRealtime";
import { Radio, Wifi } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface CustomerContextPanelProps {
  ticket: TicketType;
}

const CustomerContextPanel = ({ ticket }: CustomerContextPanelProps) => {
  const [openSections, setOpenSections] = useState({
    ticket: true,
    contact: true,
    company: true,
    timeline: false
  });
  
  // Use the real-time hook to get updates for this customer
  const { updates, loading: updatesLoading, error: updatesError } = useCustomerRealtime(
    ticket.customer,
    ticket.company
  );
  
  const [customerTimeline, setCustomerTimeline] = useState([
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
  ]);
  
  // When we receive activity updates, add them to the timeline
  useEffect(() => {
    const activityUpdates = updates.filter(update => update.type === 'activity');
    
    if (activityUpdates.length > 0) {
      const newTimelineEvents = activityUpdates.map(update => ({
        id: update.id,
        type: update.data.category as any,
        description: update.data.description,
        timestamp: update.timestamp,
        sentiment: update.data.sentiment
      }));
      
      setCustomerTimeline(prev => [...newTimelineEvents, ...prev]);
    }
  }, [updates]);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <Card className="h-full flex flex-col bg-white border-l">
      <CustomerHeader customer={ticket.customer} company={ticket.company} />
      
      {updatesError && (
        <Alert variant="destructive" className="mx-4 mt-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to connect to real-time updates: {updatesError}
          </AlertDescription>
        </Alert>
      )}
      
      {updates.length > 0 && (
        <div className="mx-4 mt-4 p-2 bg-green-50 rounded-md border border-green-100 flex items-center gap-2">
          <Wifi className="h-4 w-4 text-green-600" />
          <span className="text-sm text-green-700">
            Receiving real-time updates 
          </span>
          <Badge variant="outline" className="ml-auto bg-green-100 text-green-800">
            {updates.length} updates
          </Badge>
        </div>
      )}
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <CurrentTicketCard
            ticket={ticket}
            isOpen={openSections.ticket}
            onToggle={() => toggleSection('ticket')}
          />
          
          <ContactInfoCard
            customer={ticket.customer}
            company={ticket.company}
            isOpen={openSections.contact}
            onToggle={() => toggleSection('contact')}
          />
          
          <CompanyInfoCard
            isOpen={openSections.company}
            onToggle={() => toggleSection('company')}
          />
          
          <TimelineCard
            events={customerTimeline}
            isLoading={updatesLoading}
            isOpen={openSections.timeline}
            onToggle={() => toggleSection('timeline')}
          />
        </div>
      </ScrollArea>
    </Card>
  );
};

export default CustomerContextPanel;
