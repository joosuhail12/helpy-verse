
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from "@/components/ui/avatar";
import type { Ticket } from '@/types/ticket';

interface ConversationHeaderProps {
  ticket: Ticket;
  onClose: () => void;
}

const ConversationHeader = ({ ticket, onClose }: ConversationHeaderProps) => {
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
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="h-8 w-8"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ConversationHeader;

