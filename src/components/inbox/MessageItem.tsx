import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Check, CheckCheck, Reply, Smile } from 'lucide-react';
import { Button } from "@/components/ui/button";
import type { Message, ReadReceipt } from './types';
import type { Ticket } from '@/types/ticket';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getUserInitials, extractUsernameFromEmail } from '@/utils/userUtils';
import useCustomer from '@/hooks/use-customer';
import { useSelector } from 'react-redux';
import { selectCustomerName } from '@/store/slices/customers/customersSlice';
import { RootState } from '@/store/store';

interface MessageItemProps {
  message: Message;
  ticket: Ticket;
  onReply: (content: string) => void;
}

const MessageItem = ({ message, ticket, onReply }: MessageItemProps) => {
  // Track detailed readers list for debugging
  const [readDetails, setReadDetails] = useState<string>('');

  // Get customer name from Redux store
  const customerName = useSelector((state: RootState) =>
    ticket.customerId ? selectCustomerName(state, ticket.customerId) : undefined
  );

  // Get username from email if available
  const getSenderDisplayName = (sender: string) => {
    if (!sender) return 'Unknown';
    if (sender === 'Unknown User') return 'ClientTest30-workspace';
    // Extract username from email if it's an email format
    if (sender.includes('@')) return extractUsernameFromEmail(sender);
    // If in format with | or -, just take the first part
    if (sender.includes('|') || sender.includes('-')) {
      return sender.split(/[|-]/)[0];
    }
    return sender;
  };

  // Get initials for avatar
  const getSenderInitials = (sender: string) => {
    if (!sender) return '?';
    if (sender === 'Unknown User') return 'C';
    // If in format with | or -, just take the first part for initials
    if (sender.includes('|') || sender.includes('-')) {
      const name = sender.split(/[|-]/)[0];
      return getUserInitials(name);
    }
    return getUserInitials(sender);
  };

  // Extract readable usernames from readers, handling both string and object formats
  const getReadableReaders = () => {
    if (!message.readBy || !Array.isArray(message.readBy)) return [];

    return message.readBy.map(reader => {
      if (typeof reader === 'string') {
        return {
          userId: reader,
          name: getSenderDisplayName(reader),
          readAt: message.lastReadAt || message.timestamp
        };
      }
      return {
        userId: reader.userId,
        name: reader.name || getSenderDisplayName(reader.userId),
        readAt: reader.readAt || message.lastReadAt || message.timestamp
      };
    });
  };

  // Log read receipt details for debugging and update readDetails state
  useEffect(() => {
    if (message.readBy && message.readBy.length > 0) {
      const readers = getReadableReaders();
      const readersInfo = readers.map(reader =>
        `${reader.name} (${reader.userId})`
      ).join(', ');

      // Add null check for message.id before using substring
      const messageIdPrefix = message.id ? message.id.substring(0, 8) : 'unknown';
      setReadDetails(`Message ${messageIdPrefix}... read by: ${readersInfo}`);
      console.log(`Message ${message.id || 'unknown'} read by:`, readers);
    }
  }, [message.id, message.readBy]);

  // First check for message.senderName if available, otherwise use the sender ID
  const displayName = message.senderName || getSenderDisplayName(message.sender);

  // Get the display name for the message, using customer name from Redux for customer messages
  const finalDisplayName = message.isCustomer && customerName
    ? customerName
    : displayName;

  // Define if message is from current user (agent in conversation panel)
  // Use the custom name from Redux store if available for customer messages
  const isFromUser = message.isCustomer === false;

  // Display the read receipt only for outgoing messages from current user
  const shouldShowReadReceipt = isFromUser && message.id !== ticket.id; // Don't show for initial ticket message

  // Get readable list of readers
  const readers = getReadableReaders();

  // Determine the read status - "Read" means message has been read by someone OTHER than the sender
  const isDelivered = readers.length > 0;

  // Extract sender ID (could be the full ID or just the username)
  const senderId = message.sender;

  // Get the list of non-sender readers
  const nonSenderReaders = readers.filter(reader =>
    reader.userId !== senderId &&
    !reader.userId.startsWith(senderId.split(/[|-]/)[0])
  );

  // Message is considered read if someone other than the sender has read it
  const isRead = nonSenderReaders.length > 0;

  // Format readable timestamp
  const formattedTime = formatDistanceToNow(new Date(message.timestamp), { addSuffix: true });

  return (
    <div className={cn(
      "group relative flex gap-2 p-4 hover:bg-muted/50",
      isFromUser ? "flex-row-reverse" : "flex-row" // Right side for sent, left for received
    )}>
      <Avatar className="h-8 w-8 mt-1">
        <AvatarFallback className="bg-primary/10 text-primary">
          {getSenderInitials(message.senderName || message.sender)}
        </AvatarFallback>
      </Avatar>
      <div className={cn(
        "flex flex-col gap-1 max-w-[80%]", // Add max width to keep bubbles reasonable size
        isFromUser ? "items-end" : "items-start"
      )}>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {finalDisplayName}
          </span>
          <span className="text-xs text-muted-foreground">
            {formattedTime}
          </span>
        </div>
        <div className={cn(
          "rounded-lg px-4 py-2 text-sm",
          isFromUser
            ? "bg-primary/10 text-foreground" // Purple bubble for sent (agent) messages
            : "bg-white border border-gray-200 text-foreground" // White bubble with border for received (customer) messages
        )}>
          <div dangerouslySetInnerHTML={{ __html: message.content }} />
        </div>

        <div className="flex items-center gap-2 mt-1">
          {/* Reply button at the end of message */}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full hover:bg-primary/10"
            onClick={() => onReply(`<p>Replying to ${finalDisplayName}: "${message.content}"</p>`)}
          >
            <Reply className="h-3 w-3" />
          </Button>

          {message.type === 'internal_note' && (
            <div className="text-xs text-yellow-600 font-medium">
              Internal Note
            </div>
          )}

          {/* Read receipt status */}
          {shouldShowReadReceipt && (
            <div className="flex items-center ml-auto">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center text-xs text-muted-foreground gap-1 cursor-default">
                      {isRead ? (
                        <>
                          <CheckCheck className="h-3 w-3" />
                          <span>Read ({nonSenderReaders.length})</span>
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
                  <TooltipContent className="p-2 max-w-xs">
                    {readers.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-xs font-medium">Read by:</p>
                        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                          {readers.map((reader, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Avatar className="h-5 w-5">
                                <AvatarFallback className="text-[10px]">
                                  {getUserInitials(reader.name)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs">{reader.name}</span>
                              {reader.userId === message.sender && (
                                <span className="text-[10px] text-muted-foreground ml-1">(sender)</span>
                              )}
                              <span className="text-[8px] text-muted-foreground ml-1">
                                {reader.readAt ? formatDistanceToNow(new Date(reader.readAt), { addSuffix: true }) : ''}
                              </span>
                            </div>
                          ))}
                        </div>
                        {/* Debug info */}
                        <p className="text-[9px] text-muted-foreground mt-1 break-all">
                          {readDetails}
                        </p>
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
      </div>
    </div>
  );
};

export default MessageItem;
