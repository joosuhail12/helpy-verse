
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MessageSquare, ChevronUp, ChevronDown, AlertCircle, Clock } from "lucide-react";
import { Ticket } from '@/types/ticket';
import { InlineEditField } from "@/components/contacts/detail/InlineEditField";
import { useState } from "react";
import { useToast } from '@/hooks/use-toast';

interface CurrentTicketCardProps {
  ticket: Ticket;
  isOpen: boolean;
  onToggle: () => void;
}

const CurrentTicketCard = ({ ticket, isOpen, onToggle }: CurrentTicketCardProps) => {
  const { toast } = useToast();
  
  // In a real app, this would update through Redux
  const handleFieldSave = (field: string, value: string) => {
    toast({
      title: "Field updated",
      description: `${field} has been successfully updated.`,
    });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <Card className="border shadow-sm">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full flex items-center justify-between p-4 hover:bg-gray-50">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span className="font-medium">Current Ticket</span>
            </div>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 pt-0">
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Subject</span>
              <InlineEditField
                value={ticket.subject}
                contactId={ticket.id} // Using ticket ID as a fallback
                field="subject"
                label="Subject"
                onSave={(value) => handleFieldSave("Subject", value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Status</span>
              <Badge 
                variant={ticket.status === 'open' ? 'default' : 
                        ticket.status === 'pending' ? 'secondary' : 'outline'}
                className={ticket.status === 'closed' ? 'bg-gray-100 text-gray-800' : ''}
              >
                {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Priority</span>
              <InlineEditField
                value={ticket.priority || 'normal'}
                contactId={ticket.id}
                field="priority"
                label="Priority"
                type="select"
                options={['low', 'normal', 'high', 'urgent']}
                onSave={(value) => handleFieldSave("Priority", value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <AlertCircle className="h-4 w-4 text-gray-400" />
                <span className="text-gray-500">Source</span>
              </div>
              <InlineEditField
                value={ticket.source || 'email'}
                contactId={ticket.id}
                field="source"
                label="Source"
                type="select"
                options={['email', 'chat', 'phone', 'web']}
                onSave={(value) => handleFieldSave("Source", value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-gray-500">Created</span>
              </div>
              <span>{new Date(ticket.createdAt).toLocaleString()}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Assigned To</span>
              <InlineEditField
                value={ticket.assignedTo || ''}
                contactId={ticket.id}
                field="assignedTo"
                label="Assigned To"
                onSave={(value) => handleFieldSave("Assigned To", value)}
              />
            </div>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default CurrentTicketCard;
