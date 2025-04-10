
import { MessageSquare, Building, Tag, Clock, User, UserX, Copy, CheckCircle, Circle, ZapIcon } from 'lucide-react';
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
  isActive?: boolean;
}

const TicketCard = ({ ticket, viewMode, onCopyId, isActive = false }: TicketCardProps) => {
  const isCompact = viewMode === 'list';

  const getActiveStateClasses = () => {
    if (isActive) {
      return "border-l-4 border-[#8B5CF6] bg-primary-50/80 shadow-[0_0_20px_rgba(139,92,246,0.4)] ring-1 ring-[#8B5CF6]/30";
    }
    return "";
  };

  return (
    <div 
      className={`group relative bg-white rounded-xl p-4 hover:bg-gray-50/50 transition-all cursor-pointer w-full ${
        isCompact ? 'py-3' : ''
      } ${ticket.isUnread ? 'bg-blue-50/30' : ''} ${getActiveStateClasses()}`}
      role="article"
      aria-labelledby={`ticket-${ticket.id}-subject`}
    >
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#8B5CF6] animate-pulse"></div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {ticket.assignee ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className={`h-8 w-8 ${isActive ? "ring-2 ring-[#8B5CF6] animate-pulse" : "ring-2 ring-white"}`}>
                    {ticket.assigneeAvatar ? (
                      <AvatarImage src={ticket.assigneeAvatar} alt={ticket.assignee} />
                    ) : (
                      <AvatarFallback className={`${isActive ? "bg-[#8B5CF6]/30 text-[#8B5CF6]" : "bg-primary/10 text-primary"} text-xs`}>
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
            <div className={`w-8 h-8 rounded-full ${isActive ? "bg-[#8B5CF6]/20" : "bg-gray-100"} flex items-center justify-center ${isActive ? "ring-2 ring-[#8B5CF6]/40 animate-pulse" : "ring-2 ring-white"}`}>
              <UserX className={`w-4 h-4 ${isActive ? "text-[#8B5CF6]" : "text-gray-400"}`} />
            </div>
          )}
          
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center">
                {isActive && <ZapIcon className="h-3.5 w-3.5 text-[#8B5CF6] mr-1 animate-pulse" />}
                <h3 
                  id={`ticket-${ticket.id}-subject`}
                  className={`font-medium text-sm ${isActive ? "text-[#8B5CF6] font-semibold" : "text-gray-900"} truncate ${ticket.isUnread ? 'font-semibold' : ''}`}
                >
                  {ticket.subject}
                </h3>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCopyId();
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 shrink-0"
                aria-label={`Copy ticket ID ${ticket.id}`}
              >
                <Copy className="w-3 h-3 text-gray-400 hover:text-[#8B5CF6]" />
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-gray-600 min-w-0">
                <Building className={`w-3 h-3 ${isActive ? "text-[#8B5CF6]/70" : "text-gray-400"} shrink-0`} />
                <span className="truncate">{ticket.company}</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span className="text-xs text-gray-600 truncate">{ticket.customer}</span>
            </div>

            {!isCompact && (
              <p className={`text-xs ${isActive ? "text-gray-800" : "text-gray-500"} border-t ${isActive ? "border-[#8B5CF6]/20" : "border-gray-100/75"} pt-2 line-clamp-2`}>
                {ticket.lastMessage}
              </p>
            )}

            {!isCompact && ticket.tags.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <Tag className={`w-3 h-3 ${isActive ? "text-[#8B5CF6]/70" : "text-gray-400"}`} />
                {ticket.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`px-1.5 py-0.5 ${isActive ? "bg-[#8B5CF6]/10 text-[#8B5CF6]/90" : "bg-gray-100/75 text-gray-600"} rounded-full text-[10px] font-medium`}
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
              <TooltipTrigger className={`flex items-center gap-1.5 text-xs ${isActive ? "text-[#8B5CF6]/90" : "text-gray-500"}`}>
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{format(new Date(ticket.createdAt), 'PPpp')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {!isCompact && (
            <div className={`flex items-center gap-1.5 text-xs border-t ${isActive ? "border-[#8B5CF6]/20" : "border-gray-100/75"} pt-1.5 mt-1`}>
              {ticket.assignee ? (
                <div className="flex items-center gap-1.5 text-gray-600">
                  <User className={`w-3 h-3 ${isActive ? "text-[#8B5CF6]/70" : ""}`} />
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
                <Button variant="ghost" size="sm" className={`h-7 px-2 text-xs ${isActive ? "hover:bg-[#8B5CF6]/10 hover:text-[#8B5CF6]/90" : ""}`}>
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
