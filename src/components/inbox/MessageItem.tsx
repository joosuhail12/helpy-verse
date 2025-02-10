
import React from 'react';
import { Avatar } from "@/components/ui/avatar";
import { Check, CheckCheck, Clock } from 'lucide-react';
import type { Message } from './types';
import type { Ticket } from '@/types/ticket';

interface MessageItemProps {
  message: Message;
  ticket: Ticket;
  onReply: (content: string) => void;
}

const MessageItem = ({ message, ticket, onReply }: MessageItemProps) => {
  return (
    <div className="flex gap-3">
      <Avatar className="h-8 w-8">
        <span className="text-xs">
          {message.isCustomer ? ticket.customer[0] : 'A'}
        </span>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">
            {message.isCustomer ? ticket.customer : 'Agent'}
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {new Date(message.timestamp).toLocaleString()}
          </span>
        </div>
        <div className="mt-1 text-sm bg-secondary/20 rounded-lg p-3">
          {message.content}
        </div>
        <div className="mt-1 flex items-center gap-2">
          {!message.isCustomer && (
            <span className="text-xs text-muted-foreground">
              {message.readBy && message.readBy.length > 1 ? (
                <CheckCheck className="h-3 w-3 inline" />
              ) : (
                <Check className="h-3 w-3 inline" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
