
import React from 'react';
import { X, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from "@/components/ui/avatar";
import { Tooltip } from "@/components/ui/tooltip";
import type { Ticket } from '@/types/ticket';
import type { UserPresence } from './types';

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
            <Tooltip.Trigger asChild>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{activeUsers.length} active</span>
              </div>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <div className="space-y-1">
                {activeUsers.map((user) => (
                  <div key={user.userId} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>{user.name}</span>
                  </div>
                ))}
              </div>
            </Tooltip.Content>
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
