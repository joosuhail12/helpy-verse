
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Ticket, ChevronUp, ChevronDown, Clock, Tag, MessageCircle, AlertCircle } from "lucide-react";
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
              <span className="text-gray-500">ID</span>
              <span className="text-gray-600 font-mono text-xs">{ticket.id}</span>
            </div>
            
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
            
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Channel</span>
              <Badge variant="outline">{ticket.channel || 'Email'}</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Assignee</span>
              <span className="text-gray-600">
                {ticket.assignee || 'Unassigned'}
              </span>
            </div>
            
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="h-4 w-4 text-gray-400" />
                <span className="text-gray-500">Tags</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {ticket.tags && ticket.tags.length > 0 ? 
                  ticket.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">{tag}</Badge>
                  )) : 
                  <span className="text-gray-400 text-xs">No tags</span>
                }
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-gray-500">First response time:</span>
              <span className="text-gray-600">25 minutes</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <MessageCircle className="h-4 w-4 text-gray-400" />
              <span className="text-gray-500">Messages:</span>
              <span className="text-gray-600">5</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-gray-400" />
              <span className="text-gray-500">SLA:</span>
              <Badge variant="outline" className="bg-green-50 text-green-700">Met</Badge>
            </div>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default CurrentTicketCard;
