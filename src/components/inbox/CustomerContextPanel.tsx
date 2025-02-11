
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UserCircle, Building2, History, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import type { Ticket } from "@/types/ticket";
import CustomerTimeline from './components/CustomerTimeline';
import CustomerSubscriptions from './components/CustomerSubscriptions';
import CommunicationChannels from './components/CommunicationChannels';

interface CustomerContextPanelProps {
  ticket: Ticket;
}

const CustomerContextPanel = ({ ticket }: CustomerContextPanelProps) => {
  // In a real implementation, these would be fetched from your Node.js backend
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
    <Card className="h-full flex flex-col bg-background">
      <Tabs defaultValue="overview" className="flex-1">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1 p-4">
          <TabsContent value="overview" className="m-0">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : (
              <div className="space-y-6">
                <section className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <UserCircle className="h-5 w-5" />
                    Customer Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Name</p>
                      <p className="font-medium">{ticket.customer}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <p className="font-medium">Active</p>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Company Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Company</p>
                      <p className="font-medium">{ticket.company}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Plan</p>
                      <p className="font-medium">Enterprise</p>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </TabsContent>

          <TabsContent value="timeline" className="m-0">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <History className="h-5 w-5" />
                Customer Timeline
              </h3>
              <CustomerTimeline
                events={customerTimeline}
                isLoading={isLoading}
              />
            </div>
          </TabsContent>

          <TabsContent value="subscriptions" className="m-0">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Active Subscriptions
              </h3>
              <CustomerSubscriptions
                subscriptions={subscriptions}
                isLoading={isLoading}
              />
            </div>
          </TabsContent>

          <TabsContent value="channels" className="m-0">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Communication Channels
              </h3>
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
