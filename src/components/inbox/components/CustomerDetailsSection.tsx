
import { UserCircle, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { Ticket } from "@/types/ticket";
import CommunicationChannels from './CommunicationChannels';

interface CustomerDetailsSectionProps {
  ticket: Ticket;
  communicationChannels: Array<{
    type: 'email' | 'phone' | 'chat' | 'video';
    value: string;
    isPreferred: boolean;
    lastUsed: string;
  }>;
  isLoading: boolean;
}

const CustomerDetailsSection = ({ ticket, communicationChannels, isLoading }: CustomerDetailsSectionProps) => {
  return (
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
  );
};

export default CustomerDetailsSection;
