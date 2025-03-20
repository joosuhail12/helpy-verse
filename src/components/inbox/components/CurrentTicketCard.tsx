
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MessageSquare, ChevronUp, ChevronDown, AlertCircle, Clock } from "lucide-react";
import { Ticket } from '@/types/ticket';
import { InlineEditField } from "@/components/contacts/detail/InlineEditField";
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
    <Collapsible open={isOpen} onOpenChange={onToggle} className="group">
      <Card className="border shadow-sm hover:shadow-md transition-all duration-200">
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-t-lg group-data-[state=closed]:rounded-lg"
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span className="font-medium">Current Ticket</span>
            </div>
            {isOpen ? 
              <ChevronUp className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" /> : 
              <ChevronDown className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
            }
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 pb-4 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
          <div className="space-y-3 text-sm divide-y divide-gray-100">
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-500 font-medium">Subject</span>
              <InlineEditField
                value={ticket.subject}
                contactId={ticket.id} // Using ticket ID as a fallback
                field="subject"
                label="Subject"
                onSave={(value) => handleFieldSave("Subject", value)}
              />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-500 font-medium">Status</span>
              <Badge 
                variant={ticket.status === 'open' ? 'default' : 
                        ticket.status === 'pending' ? 'secondary' : 'outline'}
                className={`${ticket.status === 'closed' ? 'bg-gray-100 text-gray-800' : ''} transition-all`}
              >
                {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-500 font-medium">Priority</span>
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
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-gray-500 font-medium">Source</span>
              </div>
              <InlineEditField
                value={ticket.channel || 'email'}
                contactId={ticket.id}
                field="channel"
                label="Source"
                type="select"
                options={['email', 'chat', 'phone', 'web']}
                onSave={(value) => handleFieldSave("Source", value)}
              />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-gray-500 font-medium">Created</span>
              </div>
              <span className="text-sm text-gray-700">
                {new Date(ticket.createdAt).toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-500 font-medium">Assigned To</span>
              <InlineEditField
                value={ticket.assignee || ''}
                contactId={ticket.id}
                field="assignee"
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
