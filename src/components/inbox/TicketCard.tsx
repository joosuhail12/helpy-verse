import { MessageSquare, Building, Tag, Clock, User, UserX, Copy, CheckCircle, Circle } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
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
    assigneeAvatar?: string;
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
  const isCompact = viewMode === 'list';

  return (
    <div 
      className={`group bg-white rounded-xl p-4 hover:bg-gray-50/50 transition-all cursor-pointer w-full ${
        isCompact ? 'py-3' : ''
      } ${ticket.isUnread ? 'bg-blue-50/30' : ''}`}
      role="article"
      aria-labelledby={`ticket-${ticket.id}-subject`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {ticket.assignee ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className="h-8 w-8 ring-2 ring-white">
                    {ticket.assigneeAvatar ? (
                      <AvatarImage src={ticket.assigneeAvatar} alt={ticket.assignee} />
                    ) : (
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {ticket.assignee.split(' ').map(name => name[0]).join('')}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Assigned to {ticket.assignee}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center ring-2 ring-white">
              <UserX className="w-4 h-4 text-gray-400" />
            </div>
          )}
          
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-start justify-between gap-2">
              <h3 
                id={`ticket-${ticket.id}-subject`}
                className={`font-medium text-sm text-gray-900 truncate ${ticket.isUnread ? 'font-semibold' : ''}`}
              >
                {ticket.subject}
              </h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCopyId();
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 shrink-0"
                aria-label={`Copy ticket ID ${ticket.id}`}
              >
                <Copy className="w-3 h-3 text-gray-400 hover:text-primary" />
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-gray-600 min-w-0">
                <Building className="w-3 h-3 text-gray-400 shrink-0" />
                <span className="truncate">{ticket.company}</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span className="text-xs text-gray-600 truncate">{ticket.customer}</span>
            </div>

            {!isCompact && (
              <p className="text-xs text-gray-500 border-t border-gray-100/75 pt-2 line-clamp-2">
                {ticket.lastMessage}
              </p>
            )}

            {!isCompact && ticket.tags.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <Tag className="w-3 h-3 text-gray-400" />
                {ticket.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-1.5 py-0.5 bg-gray-100/75 text-gray-600 rounded-full text-[10px] font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <TicketStatusBadge status={ticket.status} />
            <TicketPriorityBadge priority={ticket.priority} />
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-1.5 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{format(new Date(ticket.createdAt), 'PPpp')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {!isCompact && (
            <div className="flex items-center gap-1.5 text-xs border-t border-gray-100/75 pt-1.5 mt-1">
              {ticket.assignee ? (
                <div className="flex items-center gap-1.5 text-gray-600">
                  <User className="w-3 h-3" />
                  <span>{ticket.assignee}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-amber-500">
                  <UserX className="w-3 h-3" />
                  <span className="font-medium">Unassigned</span>
                </div>
              )}
            </div>
          )}

          <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
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
