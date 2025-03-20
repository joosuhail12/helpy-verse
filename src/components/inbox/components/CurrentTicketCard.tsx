
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Ticket, ChevronUp, ChevronDown } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import type { Ticket as TicketType } from "@/types/ticket";

interface CurrentTicketCardProps {
  ticket: TicketType;
  isOpen: boolean;
  onToggle: () => void;
}

const CurrentTicketCard = ({ ticket, isOpen, onToggle }: CurrentTicketCardProps) => {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <Card className="border shadow-sm">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full flex items-center justify-between p-4 hover:bg-gray-50">
            <div className="flex items-center gap-2">
              <Ticket className="h-4 w-4 text-primary" />
              <span className="font-medium">Current Ticket</span>
            </div>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
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
  );
};

export default CurrentTicketCard;
