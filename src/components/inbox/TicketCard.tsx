
import { MessageSquare, Building, Tag, Clock, User, UserX } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import TicketStatusBadge from './TicketStatusBadge';
import TicketPriorityBadge from './TicketPriorityBadge';

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
  };
}

const TicketCard = ({ ticket }: TicketCardProps) => {
  return (
    <div className="bg-white rounded-lg border border-purple-100 p-4 hover:shadow-lg hover:bg-gray-50/50 transition-all cursor-pointer w-full">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-full bg-purple-100/50 flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-5 h-5 text-primary/70" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">{ticket.subject}</h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
              <Building className="w-4 h-4 text-gray-400" />
              <span className="truncate">{ticket.company}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span className="truncate">{ticket.customer}</span>
            </div>
            <p className="text-sm text-gray-500 mt-3 border-t border-gray-100 pt-3 line-clamp-2">
              {ticket.lastMessage}
            </p>
            {ticket.tags.length > 0 && (
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <Tag className="w-4 h-4 text-gray-400" />
                {ticket.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-2 flex-shrink-0">
            <TicketStatusBadge status={ticket.status} />
            <TicketPriorityBadge priority={ticket.priority} />
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
              </TooltipTrigger>
              <TooltipContent>
                {format(new Date(ticket.createdAt), 'PPpp')}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="flex items-center gap-2 text-sm text-gray-500 border-t border-gray-100 pt-2 mt-2">
            {ticket.assignee ? (
              <>
                <User className="w-4 h-4" />
                <span>{ticket.assignee}</span>
              </>
            ) : (
              <>
                <UserX className="w-4 h-4 text-amber-500" />
                <span className="text-amber-500 font-medium">Unassigned</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
