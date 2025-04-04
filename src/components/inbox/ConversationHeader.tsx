
import React from 'react';
import { X, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from "@/components/ui/avatar";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import type { Ticket } from '@/types/ticket';
import type { UserPresence } from './types';
import { formatDistanceToNow } from 'date-fns';

interface ConversationHeaderProps {
  ticket: Ticket;
  onClose: () => void;
  activeUsers: UserPresence[];
}

const ConversationHeader = ({ ticket, onClose, activeUsers }: ConversationHeaderProps) => {
  return (
    <div className="border-b p-4 flex items-center justify-between bg-white">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-lg truncate">{ticket.subject}</h2>
          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
            #{ticket.id}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Avatar className="h-5 w-5">
            <span className="text-xs">{ticket.customer[0]}</span>
          </Avatar>
          <p className="text-sm text-muted-foreground">
            {ticket.customer} • {ticket.company}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {activeUsers.length > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <Users className="h-4 w-4" />
                <div className="flex -space-x-2">
                  {activeUsers.slice(0, 3).map((user) => (
                    <Avatar key={user.userId} className="h-6 w-6 border-2 border-white">
                      <span className="text-xs">{user.name?.[0] || user.userId[0]}</span>
                    </Avatar>
                  ))}
                  {activeUsers.length > 3 && (
                    <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-white">
                      +{activeUsers.length - 3}
                    </div>
                  )}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-2">
                {activeUsers.map((user) => (
                  <div key={user.userId} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {user.location ? (
                        <>
                          viewing ticket #{user.location.ticketId}
                          {user.location.area && ` (${user.location.area})`}
                        </>
                      ) : 'browsing'}
                      • active {formatDistanceToNow(new Date(user.lastActive), { addSuffix: true })}
                    </span>
                  </div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ConversationHeader;
