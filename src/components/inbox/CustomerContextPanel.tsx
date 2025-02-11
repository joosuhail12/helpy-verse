
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { UserCircle, Building2, History, MessageCircle, Globe, Mail, Phone, Ticket } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import type { Ticket as TicketType } from "@/types/ticket";
import CustomerTimeline from './components/CustomerTimeline';
import CustomerSubscriptions from './components/CustomerSubscriptions';
import CommunicationChannels from './components/CommunicationChannels';

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

      <Tabs defaultValue="overview" className="flex-1">
        <TabsList className="w-full grid grid-cols-4 p-0 h-12 bg-gray-50/80">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-white rounded-none border-r"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="timeline" 
            className="data-[state=active]:bg-white rounded-none border-r"
          >
            Timeline
          </TabsTrigger>
          <TabsTrigger 
            value="tickets" 
            className="data-[state=active]:bg-white rounded-none border-r"
          >
            Tickets
          </TabsTrigger>
          <TabsTrigger 
            value="channels" 
            className="data-[state=active]:bg-white rounded-none"
          >
            Contact
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="overview" className="m-0 p-4">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : (
              <div className="space-y-6">
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
                  <h3 className="text-sm font-medium text-gray-500">Company Information</h3>
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
            )}
          </TabsContent>

          <TabsContent value="timeline" className="m-0 p-4">
            <div className="space-y-4">
              <CustomerTimeline
                events={customerTimeline}
                isLoading={isLoading}
              />
            </div>
          </TabsContent>

          <TabsContent value="tickets" className="m-0 p-4">
            <div className="space-y-4">
              <section className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Ticket className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Recent Tickets</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start justify-between p-3 bg-gray-50 rounded-md">
                    <div>
                      <p className="font-medium text-sm">{ticket.subject}</p>
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                      </p>
                    </div>
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
                      {ticket.status}
                    </Badge>
                  </div>
                </div>
              </section>
            </div>
          </TabsContent>

          <TabsContent value="channels" className="m-0 p-4">
            <div className="space-y-4">
              <CommunicationChannels
                channels={communicationChannels}
                isLoading={isLoading}
              />
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </Card>
  );
};

export default CustomerContextPanel;

