
import { MessageSquare, Building, Tag, Clock, User, UserX, Copy, CheckCircle, Circle } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import TicketStatusBadge from './TicketStatusBadge';
import TicketPriorityBadge from './TicketPriorityBadge';
import type { ViewMode } from '@/types/ticket';

interface TicketCardProps {
  ticket: {
    id: string;
    subject: string;
    customer: string;
    lastMessage: string;
    assignee: string | null;
    company: string;
    tags: string[];
    status: 'open' | 'closed' | 'pending';
    priority: 'low' | 'medium' | 'high';
    createdAt: string;
    isUnread?: boolean;
  };
  viewMode: ViewMode;
  onCopyId: () => void;
}

const TicketCard = ({ ticket, viewMode, onCopyId }: TicketCardProps) => {
  const isCompact = viewMode === 'compact';

  return (
    <div 
      className={`group/card bg-white rounded-md p-2.5 hover:shadow-lg hover:bg-gray-50/50 transition-all w-full ${
        isCompact ? 'py-2' : ''
      }`}
      role="article"
      aria-labelledby={`ticket-${ticket.id}-subject`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <div className="w-7 h-7 rounded-full bg-purple-100/50 flex items-center justify-center flex-shrink-0">
            {ticket.isUnread ? (
              <Circle className="w-4 h-4 text-primary/70" />
            ) : (
              <CheckCircle className="w-4 h-4 text-primary/70" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 
                id={`ticket-${ticket.id}-subject`}
                className={`text-sm truncate transition-all duration-200 ${
                  ticket.isUnread 
                    ? 'font-semibold text-gray-900' 
                    : 'font-medium text-gray-700'
                }`}
              >
                {ticket.subject}
              </h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCopyId();
                }}
                className="opacity-0 group-hover/card:opacity-100 transition-opacity focus:opacity-100"
                aria-label={`Copy ticket ID ${ticket.id}`}
              >
                <Copy className="w-3 h-3 text-gray-400 hover:text-primary transition-colors" />
              </button>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-600">
              <Building className="w-3 h-3 text-gray-400" />
              <span className="truncate">{ticket.company}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span className="truncate">{ticket.customer}</span>
            </div>
            {!isCompact && (
              <p className={`text-xs mt-2 border-t border-gray-100 pt-2 line-clamp-2 transition-colors ${
                ticket.isUnread ? 'text-gray-700' : 'text-gray-500'
              }`}>
                {ticket.lastMessage}
              </p>
            )}
            {!isCompact && ticket.tags.length > 0 && (
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <Tag className="w-3 h-3 text-gray-400" />
                {ticket.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs transition-all duration-200 hover:bg-gray-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <TicketStatusBadge status={ticket.status} />
            <TicketPriorityBadge priority={ticket.priority} />
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-1.5 text-xs text-gray-500 transition-colors hover:text-gray-700">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{format(new Date(ticket.createdAt), 'PPpp')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {!isCompact && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500 border-t border-gray-100 pt-1.5 mt-1.5">
              {ticket.assignee ? (
                <>
                  <User className="w-3 h-3" />
                  <span>{ticket.assignee}</span>
                </>
              ) : (
                <>
                  <UserX className="w-3 h-3 text-amber-500" />
                  <span className="text-amber-500 font-medium">Unassigned</span>
                </>
              )}
            </div>
          )}

          <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover/card:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs hover:bg-gray-100">
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem className="text-xs">
                  Assign to me
                </DropdownMenuItem>
                <DropdownMenuItem className="text-xs">
                  Change status
                </DropdownMenuItem>
                <DropdownMenuItem className="text-xs">
                  Change priority
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;

