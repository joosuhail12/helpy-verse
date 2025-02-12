
import { UserCircle, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { Ticket } from "@/types/ticket";
import CustomerDetailsContent from "./content/CustomerDetailsContent";

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
          <CustomerDetailsContent
            ticket={ticket}
            communicationChannels={communicationChannels}
            isLoading={isLoading}
          />
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default CustomerDetailsSection;
