import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Ticket as TicketIcon, ChevronUp, ChevronDown, Calendar, Tag, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import type { Ticket as TicketType } from "@/types/ticket";
import { TicketInlineEditField } from './inline-edit/TicketInlineEditField';
import { useEffect } from "react";
import { useAppSelector } from "@/hooks/useAppSelector";

interface CurrentTicketCardProps {
  ticket: TicketType;
  isOpen: boolean;
  onToggle: () => void;
}

// TODO: Integrate Tickets
const CurrentTicketCard = ({ ticket, isOpen, onToggle }: CurrentTicketCardProps) => {
  // Use sno if available, then ticket_sno, then fallback to id
  const ticketIdentifier = ticket.sno ? String(ticket.sno) : (ticket.ticket_sno || ticket.id);

  // Get the current ticket from Redux to ensure we have the latest data
  const { currentTicket, loading } = useAppSelector(state => state.tickets);

  // Use the ticket from props initially, but override with Redux state if available and the IDs match
  const ticketData = (currentTicket && currentTicket.id === ticket.id) ? currentTicket : ticket;

  // Log the ticket data for debugging
  useEffect(() => {
    console.log('Current ticket data:', ticketData);
  }, [ticketData]);

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <Card className="border shadow-sm">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full flex items-center justify-between p-4 hover:bg-gray-50">
            <div className="flex items-center gap-2">
              <TicketIcon className="h-4 w-4 text-primary" />
              <span className="font-medium">Current Ticket</span>
            </div>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 pt-0 space-y-3">
          <div className="grid gap-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Subject</span>
              <TicketInlineEditField
                value={ticketData.subject}
                ticketId={ticketIdentifier}
                field="subject"
                label="Subject"
                validation={[
                  { type: 'required', value: 'true', message: 'Subject is required' }
                ]}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">Status</span>
              <TicketInlineEditField
                value={ticketData.status}
                ticketId={ticketIdentifier}
                field="status"
                label="Status"
                type="select"
                options={['open', 'pending', 'closed']}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">Priority</span>
              <TicketInlineEditField
                value={ticketData.priority}
                ticketId={ticketIdentifier}
                field="priority"
                label="Priority"
                type="select"
                options={['low', 'medium', 'high']}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">Language</span>
              <TicketInlineEditField
                value={ticketData.language || 'en'}
                ticketId={ticketIdentifier}
                field="language"
                label="Language"
                type="select"
                options={['en', 'es', 'fr', 'de', 'pt', 'ja']}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">Type</span>
              <TicketInlineEditField
                value={ticketData.typeId || 'general'}
                ticketId={ticketIdentifier}
                field="typeId"
                label="Type"
                type="select"
                options={['general', 'question', 'problem', 'feature']}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">Assignee</span>
              <TicketInlineEditField
                value={ticketData.assignee || 'Unassigned'}
                ticketId={ticketIdentifier}
                field="assigneeId"
                label="Assignee"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">Created</span>
              <span className="text-gray-600">
                {formatDistanceToNow(new Date(ticketData.createdAt), { addSuffix: true })}
              </span>
            </div>

            {/* Debug section to show fetched values */}
            <div className="mt-4 pt-3 border-t border-gray-100">
              <h4 className="text-xs font-medium text-gray-500 mb-2">Fetched Values:</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Language:</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    {ticketData.language ?
                      ({
                        'en': 'English',
                        'es': 'Spanish',
                        'fr': 'French',
                        'de': 'German',
                        'pt': 'Portuguese',
                        'ja': 'Japanese'
                      }[ticketData.language] || ticketData.language)
                      : 'English (default)'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Type:</span>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700">
                    {ticketData.typeId ?
                      ticketData.typeId.charAt(0).toUpperCase() + ticketData.typeId.slice(1)
                      : 'General (default)'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Assignee:</span>
                  <Badge variant="outline" className="bg-gray-50 text-gray-700">
                    {ticketData.assignee || 'Unassigned'}
                  </Badge>
                </div>

                {/* Loading indicator */}
                {loading && (
                  <div className="text-center py-1">
                    <span className="text-xs text-blue-500">Updating...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default CurrentTicketCard;
