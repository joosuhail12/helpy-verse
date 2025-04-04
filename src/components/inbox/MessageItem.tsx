
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { MoreHorizontal, Reply } from "lucide-react";
import type { Message } from './hooks/useMessages';
import type { Ticket } from '@/types/ticket';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MessageItemProps {
  message: Message;
  ticket: Ticket;
  onReply: (content: string) => void;
}

const MessageItem = ({ message, ticket, onReply }: MessageItemProps) => {
  const formattedTime = message.timestamp ? format(new Date(message.timestamp), 'h:mm a') : '';
  const initials = message.isCustomer 
    ? ticket.customer.split(' ').map(n => n[0]).join('')
    : 'A'; // Agent
  
  const handleReply = () => {
    onReply(`@${message.isCustomer ? ticket.customer : 'Agent'} `);
  };

  return (
    <div className={cn(
      "flex gap-3 p-3",
      message.isCustomer ? "bg-muted/30" : "bg-white",
      !message.isCustomer && message.isInternalNote && "bg-yellow-50/50"
    )}>
      <Avatar className={message.isCustomer ? "bg-purple-100" : "bg-blue-100"}>
        <AvatarFallback 
          className={message.isCustomer ? "text-purple-700" : "text-blue-700"}
        >
          {initials}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-1">
        <div className="flex justify-between items-start">
          <div className="font-medium">
            {message.isCustomer ? ticket.customer : 'Support Agent'}
            {!message.isCustomer && message.isInternalNote && (
              <span className="ml-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded">
                Internal Note
              </span>
            )}
          </div>
          <div className="flex items-center text-xs text-muted-foreground gap-2">
            {formattedTime}
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="text-sm" dangerouslySetInnerHTML={{ __html: message.content }} />
        
        <div className="pt-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground"
            onClick={handleReply}
          >
            <Reply className="h-3.5 w-3.5" />
            Reply
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
