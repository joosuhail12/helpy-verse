
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UserCircle, Building2, Hash, History, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import type { Ticket } from "@/types/ticket";

interface CustomerContextPanelProps {
  ticket: Ticket;
}

const CustomerContextPanel = ({ ticket }: CustomerContextPanelProps) => {
  // In a real implementation, these would be fetched from your Node.js backend
  const isLoading = false;
  const customerHistory = [
    {
      id: '1',
      type: 'ticket_created',
      description: 'Opened new ticket: Cannot access account',
      timestamp: '2024-03-10T10:00:00Z'
    },
    {
      id: '2',
      type: 'purchase',
      description: 'Purchased Premium Plan',
      timestamp: '2024-03-08T15:30:00Z'
    }
  ];

  const previousConversations = [
    {
      id: '1',
      subject: 'Billing inquiry',
      status: 'closed',
      lastMessage: 'Thank you for your help!',
      timestamp: '2024-03-01T10:00:00Z'
    }
  ];

  return (
    <Card className="h-full flex flex-col bg-background">
      <Tabs defaultValue="overview" className="flex-1">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
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

                <section className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Hash className="h-5 w-5" />
                    Ticket Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <p className="font-medium capitalize">{ticket.status}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Priority</p>
                      <p className="font-medium capitalize">{ticket.priority}</p>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="m-0">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <History className="h-5 w-5" />
                Customer History
              </h3>
              {customerHistory.map((event) => (
                <div key={event.id} className="border-l-2 border-muted pl-4 py-2">
                  <p className="text-sm">{event.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="conversations" className="m-0">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Previous Conversations
              </h3>
              {previousConversations.map((conv) => (
                <Card key={conv.id} className="p-4">
                  <h4 className="font-medium text-sm">{conv.subject}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{conv.lastMessage}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs bg-muted px-2 py-1 rounded-full">
                      {conv.status}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(conv.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </Card>
  );
};

export default CustomerContextPanel;
