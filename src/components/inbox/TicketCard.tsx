
import { MessageSquare, Building, Tag, Clock, User, UserX, Copy, CheckCircle2, CircleDot } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
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
      className={`group/card rounded-lg p-4 transition-all w-full ${
        isCompact ? 'py-3' : ''
      }`}
      role="article"
      aria-labelledby={`ticket-${ticket.id}-subject`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">
          {ticket.isUnread ? (
            <CircleDot className="h-5 w-5 text-primary" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-gray-400" />
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 
                id={`ticket-${ticket.id}-subject`}
                className={`text-base truncate ${
                  ticket.isUnread 
                    ? 'font-semibold text-gray-900' 
                    : 'font-medium text-gray-700'
                }`}
              >
                {ticket.subject}
              </h3>
              
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                <Building className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="truncate font-medium">{ticket.company}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <span className="truncate">{ticket.customer}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                ticket.status === 'open' ? 'bg-green-50 text-green-700' :
                ticket.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {ticket.status}
              </div>
              
              <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                ticket.priority === 'high' ? 'bg-red-50 text-red-700' :
                ticket.priority === 'medium' ? 'bg-amber-50 text-amber-700' :
                'bg-blue-50 text-blue-700'
              }`}>
                {ticket.priority}
              </div>
            </div>
          </div>

          {!isCompact && (
            <p className={`text-sm mt-2 line-clamp-2 ${
              ticket.isUnread ? 'text-gray-700' : 'text-gray-500'
            }`}>
              {ticket.lastMessage}
            </p>
          )}

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3">
              {ticket.tags.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {ticket.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs hover:bg-gray-200 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <span>{formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">{format(new Date(ticket.createdAt), 'PPpp')}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="flex items-center gap-1.5">
                {ticket.assignee ? (
                  <>
                    <User className="w-4 h-4" />
                    <span>{ticket.assignee}</span>
                  </>
                ) : (
                  <>
                    <UserX className="w-4 h-4 text-amber-500" />
                    <span className="text-amber-500">Unassigned</span>
                  </>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover/card:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  onCopyId();
                }}
              >
                <Copy className="w-3.5 h-3.5" />
                <span className="sr-only">Copy ticket ID</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
