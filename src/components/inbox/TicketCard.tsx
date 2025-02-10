
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
      className={`group bg-transparent p-3 hover:bg-gray-50/50 transition-all cursor-pointer w-full`}
      role="article"
      aria-labelledby={`ticket-${ticket.id}-subject`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-full bg-purple-100/50 flex items-center justify-center flex-shrink-0">
            {ticket.isUnread ? (
              <Circle className="w-4 h-4 text-primary/70" />
            ) : (
              <CheckCircle className="w-4 h-4 text-primary/70" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 
                id={`ticket-${ticket.id}-subject`}
                className={`font-medium text-gray-900 truncate text-sm ${ticket.isUnread ? 'font-semibold' : ''}`}
              >
                {ticket.subject}
              </h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCopyId();
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                aria-label={`Copy ticket ID ${ticket.id}`}
              >
                <Copy className="w-3.5 h-3.5 text-gray-400 hover:text-primary" />
              </button>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-600">
              <Building className="w-3.5 h-3.5 text-gray-400" />
              <span className="truncate">{ticket.company}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span className="truncate">{ticket.customer}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <TicketStatusBadge status={ticket.status} />
            <TicketPriorityBadge priority={ticket.priority} />
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-1.5 text-xs text-gray-500">
                <Clock className="w-3.5 h-3.5" />
                {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
              </TooltipTrigger>
              <TooltipContent>
                {format(new Date(ticket.createdAt), 'PPpp')}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  Assign to me
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Change status
                </DropdownMenuItem>
                <DropdownMenuItem>
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
