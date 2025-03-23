
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AtSign, Clock, Copy, Tag } from "lucide-react";
import type { Ticket, ViewMode } from "@/types/ticket";
import { formatDistanceToNow } from "date-fns";

interface TicketListItemProps {
  ticket: Ticket;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  viewMode: ViewMode;
  isActive?: boolean;
  isLoading?: boolean;
  onCopyId?: (id: string, e: React.MouseEvent) => void;
}

const TicketListItem = ({
  ticket,
  isSelected,
  onSelect,
  viewMode,
  isActive = false,
  isLoading = false,
  onCopyId,
}: TicketListItemProps) => {
  const formattedDate = formatDistanceToNow(new Date(ticket.createdAt), {
    addSuffix: true,
  });

  const statusColors = {
    open: "bg-green-100 text-green-800 border-green-200",
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    closed: "bg-gray-100 text-gray-800 border-gray-200",
    resolved: "bg-blue-100 text-blue-800 border-blue-200",
  };

  const priorityColors = {
    high: "bg-red-100 text-red-800 border-red-200",
    medium: "bg-blue-100 text-blue-800 border-blue-200",
    low: "bg-purple-100 text-purple-800 border-purple-200",
    urgent: "bg-red-100 text-red-800 border-red-200",
  };

  // Get customer and company names safely
  const customerName = typeof ticket.customer === 'string' 
    ? ticket.customer 
    : ticket.customer.name;

  const companyName = typeof ticket.company === 'string'
    ? ticket.company
    : ticket.company.name;

  const assigneeName = ticket.assignee 
    ? (typeof ticket.assignee === 'string' 
      ? ticket.assignee 
      : ticket.assignee.name) 
    : '';

  return (
    <div
      className={`border rounded-lg overflow-hidden transition-all duration-200 ${
        isActive
          ? "border-primary/50 bg-primary/5 shadow-md"
          : "border-gray-200 bg-white hover:border-gray-300"
      } ${isLoading ? "opacity-70 pointer-events-none" : ""} ${
        ticket.isUnread ? "border-l-4 border-l-primary" : ""
      }`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="pt-0.5" onClick={onSelect}>
            <Checkbox checked={isSelected} />
          </div>
          <div className="flex-1 space-y-2 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                {ticket.hasNotification && (
                  <div className="flex-none">
                    {ticket.notificationType === "mention" ? (
                      <Badge
                        variant="secondary"
                        className="flex items-center bg-blue-100 hover:bg-blue-200 text-blue-700"
                      >
                        <AtSign className="mr-1 h-3 w-3" />
                        Mention
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="flex items-center bg-purple-100 hover:bg-purple-200 text-purple-700"
                      >
                        Assignment
                      </Badge>
                    )}
                  </div>
                )}
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {ticket.subject}
                </h3>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <Badge className={statusColors[ticket.status]}>
                  {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                </Badge>
                <Badge className={priorityColors[ticket.priority]}>
                  {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                </Badge>
              </div>
            </div>

            <div
              className={`flex ${
                viewMode === "detailed" ? "flex-col" : "flex-row items-center justify-between"
              } gap-2`}
            >
              <p
                className={`text-gray-700 ${
                  viewMode === "detailed" ? "line-clamp-2" : "line-clamp-1"
                } text-sm`}
              >
                {ticket.lastMessage}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>{formattedDate}</span>
              </div>
            </div>

            {viewMode === "detailed" && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <p>{customerName}</p>
                  <span className="text-gray-400">•</span>
                  <p>{companyName}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {ticket.tags?.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs bg-gray-50 hover:bg-gray-100"
                    >
                      <Tag className="mr-1 h-2.5 w-2.5" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {viewMode === "detailed" && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {ticket.assignee ? (
                    <p>Assigned to: {assigneeName}</p>
                  ) : (
                    <p className="text-amber-600">Unassigned</p>
                  )}
                </div>
                <div
                  className="text-xs text-gray-500 flex items-center cursor-pointer hover:text-gray-700"
                  onClick={(e) => onCopyId && onCopyId(ticket.id, e)}
                >
                  <span className="mr-1">ID: {ticket.id}</span>
                  <Copy className="h-3 w-3" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketListItem;
