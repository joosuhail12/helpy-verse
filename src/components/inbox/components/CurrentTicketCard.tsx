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
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { resetLoading } from "@/store/slices/tickets/ticketsSlice";

interface CurrentTicketCardProps {
  ticket: TicketType;
  isOpen: boolean;
  onToggle: () => void;
}

// TODO: Integrate Tickets
const CurrentTicketCard = ({ ticket, isOpen, onToggle }: CurrentTicketCardProps) => {
  // Use sno if available, then ticket_sno, then fallback to id
  const ticketIdentifier = ticket.sno ? String(ticket.sno) : (ticket.ticket_sno || ticket.id);
  const dispatch = useAppDispatch();

  // Get the current ticket from Redux to ensure we have the latest data
  const { currentTicket, loading } = useAppSelector(state => state.tickets);

  // Use the ticket from props initially, but override with Redux state if available and the IDs match
  const ticketData = (currentTicket && currentTicket.id === ticket.id) ? currentTicket : ticket;

  // Reset loading state when component mounts or if we detect a stuck loading state
  useEffect(() => {
    // Initial reset to ensure clean state
    dispatch(resetLoading());

    // Setup a timer to periodically check and reset loading state if needed
    const checkTimer = setInterval(() => {
      if (loading) {
        console.log("Detected stuck loading state, resetting...");
        dispatch(resetLoading());
      }
    }, 10000); // Check every 10 seconds

    return () => {
      clearInterval(checkTimer);
      dispatch(resetLoading());
    };
  }, [dispatch]);

  // Log the ticket data for debugging
  useEffect(() => {
    console.log('Current ticket data:', ticketData);

    // If ticket data changes but loading is true, unstuck it
    if (loading) {
      const timer = setTimeout(() => {
        dispatch(resetLoading());
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [ticketData, loading, dispatch]);

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
            <div className="grid grid-cols-[120px_1fr] items-center gap-2 py-1.5">
              <span className="text-gray-500 font-medium">Subject</span>
              <div>
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
            </div>

            <div className="grid grid-cols-[120px_1fr] items-center gap-2 py-1.5">
              <span className="text-gray-500 font-medium">Status</span>
              <div>
                <TicketInlineEditField
                  value={ticketData.status}
                  ticketId={ticketIdentifier}
                  field="status"
                  label="Status"
                  type="select"
                  options={['open', 'pending', 'closed']}
                />
              </div>
            </div>

            <div className="grid grid-cols-[120px_1fr] items-center gap-2 py-1.5">
              <span className="text-gray-500 font-medium">Priority</span>
              <div>
                <TicketInlineEditField
                  value={ticketData.priority}
                  ticketId={ticketIdentifier}
                  field="priority"
                  label="Priority"
                  type="select"
                  options={['low', 'medium', 'high']}
                />
              </div>
            </div>

            <div className="grid grid-cols-[120px_1fr] items-center gap-2 py-1.5">
              <span className="text-gray-500 font-medium">Language</span>
              <div>
                <TicketInlineEditField
                  value={ticketData.language || 'en'}
                  ticketId={ticketIdentifier}
                  field="language"
                  label="Language"
                  type="select"
                  options={['en', 'es', 'fr', 'de', 'pt', 'ja']}
                />
              </div>
            </div>

            <div className="grid grid-cols-[120px_1fr] items-center gap-2 py-1.5">
              <span className="text-gray-500 font-medium">Type</span>
              <div>
                <TicketInlineEditField
                  value={ticketData.typeId || 'general'}
                  ticketId={ticketIdentifier}
                  field="typeId"
                  label="Type"
                  type="select"
                  options={['general', 'question', 'problem', 'feature']}
                />
              </div>
            </div>

            <div className="grid grid-cols-[120px_1fr] items-center gap-2 py-1.5">
              <span className="text-gray-500 font-medium">Assignee</span>
              <div>
                <TicketInlineEditField
                  value={ticketData.assignee || 'Unassigned'}
                  ticketId={ticketIdentifier}
                  field="assigneeId"
                  label="Assignee"
                />
              </div>
            </div>

            <div className="grid grid-cols-[120px_1fr] items-center gap-2 py-1.5">
              <span className="text-gray-500 font-medium">Created</span>
              <span className="text-gray-700">
                {formatDistanceToNow(new Date(ticketData.createdAt), { addSuffix: true })}
              </span>
            </div>

            {/* Debug section to show fetched values */}
            <div className="mt-4 pt-3 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-600 mb-3">Fetched Values:</h4>
              <div className="space-y-2 ml-2">
                <div className="grid grid-cols-[120px_1fr] items-center gap-2 py-1">
                  <span className="text-gray-500 font-medium">Language:</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 w-fit">
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
                <div className="grid grid-cols-[120px_1fr] items-center gap-2 py-1">
                  <span className="text-gray-500 font-medium">Type:</span>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 w-fit">
                    {ticketData.typeId ?
                      ticketData.typeId.charAt(0).toUpperCase() + ticketData.typeId.slice(1)
                      : 'General (default)'}
                  </Badge>
                </div>
                <div className="grid grid-cols-[120px_1fr] items-center gap-2 py-1">
                  <span className="text-gray-500 font-medium">Assignee:</span>
                  <Badge variant="outline" className="bg-gray-50 text-gray-700 w-fit">
                    {ticketData.assignee || 'Unassigned'}
                  </Badge>
                </div>

                {/* Loading indicator */}
                {loading && (
                  <div className="text-center py-1 mt-2">
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
