
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, StickyNote } from "lucide-react";
import MessageItem from '../MessageItem';
import type { Message } from '../types';
import type { Ticket } from '@/types/ticket';
import { cn } from "@/lib/utils";

interface MessageListProps {
  messages: Message[];
  typingUsers: string[];
  ticket: Ticket;
  onReply: (content: string) => void;
  isLoading?: boolean;
}

const MessageList = ({ messages, typingUsers, ticket, onReply, isLoading }: MessageListProps) => {
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={cn(
              "relative",
              message.type === 'internal_note' && "pl-8 border-l-2 border-yellow-400"
            )}
          >
            {message.type === 'internal_note' && (
              <StickyNote className="h-4 w-4 absolute left-2 top-3 text-yellow-500" />
            )}
            <MessageItem
              message={message}
              ticket={ticket}
              onReply={onReply}
            />
          </div>
        ))}
        {typingUsers.length > 0 && (
          <div className="text-sm text-muted-foreground animate-pulse">
            {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default MessageList;
