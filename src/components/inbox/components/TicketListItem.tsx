import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDistanceToNow } from "date-fns";
import { Copy, Mail, User } from "lucide-react";
import TicketPriorityBadge from "../TicketPriorityBadge";
import TicketStatusBadge from "../TicketStatusBadge";
import type { Ticket, ViewMode } from "@/types/ticket";

interface TicketListItemProps {
  ticket: Ticket;
  isSelected?: boolean;
  onSelect?: (e: React.MouseEvent) => void;
  viewMode?: ViewMode;
  isLoading?: boolean;
  onCopyId?: (id: string, e: React.MouseEvent) => void;
  isActive?: boolean;
}

const TicketListItem = ({
  ticket,
  isSelected = false,
  onSelect,
  viewMode = "list",
  isLoading = false,
  onCopyId,
  isActive = false,
}: TicketListItemProps) => {
  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(e);
  };

  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCopyId?.(ticket.id, e);
  };

  const getActiveStateClasses = () => {
    if (isActive) {
      return "border-primary-500 border-l-4 bg-primary-50/30 shadow-md transform transition-all duration-300";
    }
    return "";
  };

  if (viewMode === "compact") {
    return (
      <Card className={`mb-2 overflow-hidden ${isSelected ? "border-primary" : ""} ${isLoading ? "opacity-60" : ""} ${getActiveStateClasses()}`}>
        <div className="flex items-center p-3">
          {onSelect && (
            <div className="mr-3" onClick={handleSelect}>
              <Checkbox checked={isSelected} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-medium truncate">{ticket.subject}</h3>
              {ticket.isUnread && <Badge className="bg-blue-500">New</Badge>}
            </div>
            <p className="text-xs text-gray-500 truncate">
              {ticket.customer} • {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
            </p>
          </div>
          <div className="flex items-center space-x-2 ml-2">
            <TicketStatusBadge status={ticket.status} size="sm" />
            <TicketPriorityBadge priority={ticket.priority} size="sm" />
          </div>
        </div>
      </Card>
    );
  }

  if (viewMode === "card") {
    return (
      <Card className={`overflow-hidden ${isSelected ? "border-primary" : ""} ${isLoading ? "opacity-60" : ""} ${getActiveStateClasses()}`}>
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center">
              {onSelect && (
                <div className="mr-3" onClick={handleSelect}>
                  <Checkbox checked={isSelected} />
                </div>
              )}
              <h3 className="text-base font-medium">{ticket.subject}</h3>
              {ticket.isUnread && <Badge className="ml-2 bg-blue-500">New</Badge>}
            </div>
            <div className="flex space-x-1">
              <TicketStatusBadge status={ticket.status} />
              <TicketPriorityBadge priority={ticket.priority} />
            </div>
          </div>
          <p className="text-sm text-gray-700 mb-3">{ticket.lastMessage}</p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <User className="w-3 h-3 mr-1" />
              <span>{ticket.customer}</span>
              {ticket.company && (
                <>
                  <span className="mx-1">•</span>
                  <span>{ticket.company}</span>
                </>
              )}
            </div>
            <div className="flex items-center">
              <span>{formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}</span>
              {onCopyId && (
                <button 
                  onClick={handleCopyId}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  <Copy className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`mb-2 overflow-hidden ${isSelected ? "border-primary" : ""} ${isLoading ? "opacity-60" : ""} ${getActiveStateClasses()} transition-all duration-300`}>
      <div className="flex items-center p-4">
        {onSelect && (
          <div className="mr-4" onClick={handleSelect}>
            <Checkbox checked={isSelected} />
          </div>
        )}
        <div className="mr-4 flex-shrink-0">
          <div className="bg-gray-100 rounded-full p-2">
            <Mail className="h-5 w-5 text-gray-500" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <h3 className="text-sm font-medium">{ticket.subject}</h3>
            {ticket.isUnread && <Badge className="ml-2 bg-blue-500">New</Badge>}
            {ticket.hasNotification && (
              <Badge className="ml-2 bg-amber-500">
                {ticket.notificationType === "mention" ? "Mention" : "Assignment"}
              </Badge>
            )}
          </div>
          <p className="text-xs text-gray-500 mb-1">
            From: {ticket.customer} {ticket.company && `(${ticket.company})`}
          </p>
          <p className="text-sm text-gray-700 truncate">{ticket.lastMessage}</p>
        </div>
        <div className="ml-4 flex-shrink-0 flex flex-col items-end space-y-2">
          <div className="flex space-x-2">
            <TicketStatusBadge status={ticket.status} />
            <TicketPriorityBadge priority={ticket.priority} />
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <span>{formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}</span>
            {onCopyId && (
              <button 
                onClick={handleCopyId}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                <Copy className="w-3 h-3" />
              </button>
            )}
          </div>
          {ticket.tags.length > 0 && (
            <div className="flex gap-1 flex-wrap justify-end mt-2">
              {ticket.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {ticket.tags.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{ticket.tags.length - 2}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TicketListItem;
