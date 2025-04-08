import React, { useState } from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Check, CheckCheck, Smile } from 'lucide-react';
import { Button } from "@/components/ui/button";
import type { Message } from './types';
import type { Ticket } from '@/types/ticket';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MessageItemProps {
  message: Message;
  ticket: Ticket;
  onReply: (content: string) => void;
}

const MessageItem = ({ message, ticket, onReply }: MessageItemProps) => {
  const [showReaders, setShowReaders] = useState(false);

  // Check if message is from the user (either UserTest30 or ClientTest30)
  const isFromUser = message.sender === 'UserTest30 test' ||
    message.sender === 'ClientTest30-workspace' ||
    message.sender.startsWith('ClientTest30');

  // Display the read receipt only for outgoing messages
  const shouldShowReadReceipt = isFromUser && message.readBy;

  // Determine the read status
  const isDelivered = message.readBy && message.readBy.length > 0;
  const isRead = message.readBy && message.readBy.length > 1;

  return (
    <div className={cn(
      "group relative flex gap-2 p-4 hover:bg-muted/50",
      isFromUser ? "flex-row-reverse" : "flex-row"
    )}>
      <Avatar className="h-8 w-8 mt-1">
        <AvatarFallback className="bg-primary/10 text-primary">
          {message.sender[0]?.toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className={cn(
        "flex flex-col gap-1 max-w-[80%]",
        isFromUser ? "items-end" : "items-start"
      )}>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {message.sender === 'Unknown User' ? 'ClientTest30-workspace' : message.sender}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
          </span>
        </div>
        <div className={cn(
          "rounded-lg px-4 py-2 text-sm",
          isFromUser
            ? "bg-primary/10 text-foreground"
            : "bg-white border text-foreground"
        )}>
          <div dangerouslySetInnerHTML={{ __html: message.content }} />
        </div>
        {message.type === 'internal_note' && (
          <div className="text-xs text-yellow-600 font-medium mt-1">
            Internal Note
          </div>
        )}

        {/* Read receipt status */}
        {shouldShowReadReceipt && (
          <div className="flex items-center justify-end mt-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center text-xs text-muted-foreground gap-1 cursor-default">
                    {isRead ? (
                      <>
                        <CheckCheck className="h-3 w-3" />
                        <span>Read</span>
                      </>
                    ) : isDelivered ? (
                      <>
                        <Check className="h-3 w-3" />
                        <span>Delivered</span>
                      </>
                    ) : (
                      <span>Sending...</span>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent className="p-2">
                  {message.readBy && message.readBy.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-xs font-medium">Read by:</p>
                      <div className="flex flex-col gap-2">
                        {message.readBy.map((reader, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="text-[10px]">
                                {reader[0]?.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs">{reader}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p>Not read by anyone yet</p>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
      <div className={cn(
        "absolute right-4 top-4 flex items-center gap-2 opacity-0 transition-opacity",
        "group-hover:opacity-100"
      )}>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onReply(`<p>Replying to ${message.sender}: "${message.content}"</p>`)}
        >
          <Smile className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MessageItem;
