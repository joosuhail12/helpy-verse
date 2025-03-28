
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, StickyNote } from "lucide-react";
import { Virtuoso } from 'react-virtuoso';
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
  useVirtualization?: boolean;
}

const MessageList = ({ 
  messages, 
  typingUsers, 
  ticket, 
  onReply, 
  isLoading, 
  useVirtualization = messages.length > 30 // Auto-enable for large message lists
}: MessageListProps) => {
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Use virtualized list for large message histories
  if (useVirtualization) {
    return (
      <div className="flex-1 relative">
        <Virtuoso
          style={{ height: '100%', width: '100%' }}
          data={messages}
          itemContent={(index, message) => (
            <div key={message.id} className="p-4">
              <div 
                className={cn(
                  "relative",
                  message.type === 'internal_note' && "pl-8 border-l-2 border-yellow-400 bg-yellow-50/50 rounded-lg",
                )}
              >
                {message.type === 'internal_note' && (
                  <div className="absolute left-2 top-3">
                    <StickyNote className="h-4 w-4 text-yellow-600" />
                  </div>
                )}
                <MessageItem
                  message={message}
                  ticket={ticket}
                  onReply={onReply}
                />
              </div>
            </div>
          )}
          components={{
            Footer: typingUsers.length > 0 ? () => (
              <div className="p-4 text-sm text-muted-foreground animate-pulse">
                {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
              </div>
            ) : undefined
          }}
          followOutput="smooth"
          initialTopMostItemIndex={messages.length - 1}
        />
      </div>
    );
  }

  // Original implementation for smaller message lists
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={cn(
              "relative",
              message.type === 'internal_note' && "pl-8 border-l-2 border-yellow-400 bg-yellow-50/50 rounded-lg",
            )}
          >
            {message.type === 'internal_note' && (
              <div className="absolute left-2 top-3">
                <StickyNote className="h-4 w-4 text-yellow-600" />
              </div>
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
