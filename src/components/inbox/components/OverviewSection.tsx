
import { Mail, Phone, Globe, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { History } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { formatDistanceToNow } from 'date-fns';
import type { Ticket } from "@/types/ticket";

interface OverviewSectionProps {
  ticket: Ticket;
}

const OverviewSection = ({ ticket }: OverviewSectionProps) => {
  return (
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
  );
};

export default OverviewSection;
