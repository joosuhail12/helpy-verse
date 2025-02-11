
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import MessageItem from '../MessageItem';
import type { Message } from '../types';
import type { Ticket } from '@/types/ticket';

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
          <MessageItem
            key={message.id}
            message={message}
            ticket={ticket}
            onReply={onReply}
          />
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
