
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserCircle, Building2, History, MessageCircle, Globe, Mail, Phone, Ticket, ChevronUp, ChevronDown } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import type { Ticket as TicketType } from "@/types/ticket";
import CustomerTimeline from './components/CustomerTimeline';
import CustomerSubscriptions from './components/CustomerSubscriptions';
import CommunicationChannels from './components/CommunicationChannels';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CustomerContextPanelProps {
  ticket: TicketType;
}

const CustomerContextPanel = ({ ticket }: CustomerContextPanelProps) => {
  const isLoading = false;
  const [openSections, setOpenSections] = useState({
    ticket: true,
    contact: true,
    company: true,
    timeline: false
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

  const subscriptions = [
    {
      id: 'sub1',
      name: 'Premium Plan',
      status: 'active' as const,
      startDate: '2024-03-08T15:30:00Z',
      price: 49.99
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
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Customer Details</h2>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Active
          </Badge>
        </div>
        <div className="flex items-center space-x-3 mb-2">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <UserCircle className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{ticket.customer}</p>
            <p className="text-sm text-gray-500">{ticket.company}</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {/* Ticket Information */}
          <Collapsible open={openSections.ticket} onOpenChange={() => toggleSection('ticket')}>
            <Card className="border shadow-sm">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full flex items-center justify-between p-4 hover:bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Ticket className="h-4 w-4 text-primary" />
                    <span className="font-medium">Current Ticket</span>
                  </div>
                  {openSections.ticket ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 pt-0 space-y-3">
                <div className="grid gap-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Subject</span>
                    <span className="text-gray-600">{ticket.subject}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Status</span>
                    <Badge 
                      variant="outline" 
                      className={
                        ticket.status === 'open' 
                          ? 'bg-green-50 text-green-700' 
                          : ticket.status === 'pending' 
                          ? 'bg-yellow-50 text-yellow-700'
                          : 'bg-gray-50 text-gray-700'
                      }
                    >
                      {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Priority</span>
                    <Badge 
                      variant="outline" 
                      className={
                        ticket.priority === 'high' 
                          ? 'bg-red-50 text-red-700' 
                          : ticket.priority === 'medium' 
                          ? 'bg-yellow-50 text-yellow-700'
                          : 'bg-blue-50 text-blue-700'
                      }
                    >
                      {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Created</span>
                    <span className="text-gray-600">
                      {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Contact Information */}
          <Collapsible open={openSections.contact} onOpenChange={() => toggleSection('contact')}>
            <Card className="border shadow-sm">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full flex items-center justify-between p-4 hover:bg-gray-50">
                  <div className="flex items-center gap-2">
                    <UserCircle className="h-4 w-4 text-primary" />
                    <span className="font-medium">Contact Information</span>
                  </div>
                  {openSections.contact ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 pt-0">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{ticket.customer}@example.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{ticket.company}.com</span>
                  </div>
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Company Information */}
          <Collapsible open={openSections.company} onOpenChange={() => toggleSection('company')}>
            <Card className="border shadow-sm">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full flex items-center justify-between p-4 hover:bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    <span className="font-medium">Company Information</span>
                  </div>
                  {openSections.company ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 pt-0">
                <div className="grid gap-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Plan</span>
                    <Badge variant="secondary">Enterprise</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Status</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Customer Since</span>
                    <span className="text-gray-600">March 2024</span>
                  </div>
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Timeline */}
          <Collapsible open={openSections.timeline} onOpenChange={() => toggleSection('timeline')}>
            <Card className="border shadow-sm">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full flex items-center justify-between p-4 hover:bg-gray-50">
                  <div className="flex items-center gap-2">
                    <History className="h-4 w-4 text-primary" />
                    <span className="font-medium">Timeline</span>
                  </div>
                  {openSections.timeline ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4">
                <CustomerTimeline
                  events={customerTimeline}
                  isLoading={isLoading}
                />
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </div>
      </ScrollArea>
    </Card>
  );
};

export default CustomerContextPanel;

