
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { UserCircle, Building2, History, ChevronDown, Globe, Mail, Phone, Ticket, CalendarDays, Users } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import type { Ticket as TicketType } from "@/types/ticket";
import CustomerTimeline from './components/CustomerTimeline';
import CommunicationChannels from './components/CommunicationChannels';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface CustomerContextPanelProps {
  ticket: TicketType;
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
          <Collapsible defaultOpen>
            <Card className="border shadow-sm">
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4 text-gray-500" />
                  <h3 className="text-sm font-medium">Overview</h3>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-4 pt-0 space-y-6">
                  <section className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-500">Quick Contact</h3>
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
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-500">Current Ticket</h3>
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
                  </section>
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          <Collapsible>
            <Card className="border shadow-sm">
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
                <div className="flex items-center gap-2">
                  <UserCircle className="h-4 w-4 text-gray-500" />
                  <h3 className="text-sm font-medium">Customer</h3>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-4 pt-0 space-y-4">
                  <section className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-500">Customer Information</h3>
                    <div className="grid gap-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Name</span>
                        <span className="text-gray-600">{ticket.customer}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Joined</span>
                        <span className="text-gray-600">March 2024</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Total Tickets</span>
                        <span className="text-gray-600">5</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Last Activity</span>
                        <span className="text-gray-600">2 hours ago</span>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Communication Channels</h3>
                    <CommunicationChannels
                      channels={communicationChannels}
                      isLoading={isLoading}
                    />
                  </section>
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          <Collapsible>
            <Card className="border shadow-sm">
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <h3 className="text-sm font-medium">Company</h3>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-4 pt-0 space-y-4">
                  <section className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-500">Company Details</h3>
                    <div className="grid gap-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Company Name</span>
                        <span className="text-gray-600">{ticket.company}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Industry</span>
                        <span className="text-gray-600">Technology</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Total Users</span>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">50+</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Customer Since</span>
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">March 2024</span>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-500">Recent Activity</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-600">New ticket created</span>
                        <span className="text-xs text-gray-500">2 hours ago</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-600">User added</span>
                        <span className="text-xs text-gray-500">1 day ago</span>
                      </div>
                    </div>
                  </section>
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          <Collapsible>
            <Card className="border shadow-sm">
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4 text-gray-500" />
                  <h3 className="text-sm font-medium">Timeline</h3>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200" />
              </CollapsibleTrigger>
              <CollapsibleContent>
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

