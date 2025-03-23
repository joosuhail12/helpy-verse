
import React, { useState, useEffect } from 'react';
import { Avatar } from "@/components/ui/avatar";
import { Check, CheckCheck, Clock, Smile } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { publishToChannel, subscribeToChannel } from '@/utils/ably';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Message } from './types';
import type { Ticket } from '@/types/ticket';

interface MessageItemProps {
  message: Message;
  ticket: Ticket;
  onReply?: (content: string) => void;
}

const COMMON_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

const MessageItem = ({ message, ticket }: MessageItemProps) => {
  const [reactions, setReactions] = useState<Record<string, string[]>>(message.reactions || {});

  useEffect(() => {
    const setupReactions = async () => {
      try {
        // Subscribe to reaction updates
        const cleanup = await subscribeToChannel(
          `ticket:${ticket.id}:reactions`, 
          `message:${message.id}:reaction`, 
          (msg: any) => {
            setReactions(msg.data);
          }
        );

        return cleanup;
      } catch (error) {
        console.error('Error setting up reaction subscription:', error);
        return () => {};
      }
    };

    const cleanupPromise = setupReactions();
    
    return () => {
      cleanupPromise.then(cleanup => cleanup());
    };
  }, [message.id, ticket.id]);

  const handleReaction = async (emoji: string) => {
    try {
      const userId = 'Agent'; // In a real app, this would be the actual user ID
      
      const newReactions = { ...reactions };
      if (!newReactions[emoji]) {
        newReactions[emoji] = [];
      }
      
      const hasReacted = newReactions[emoji].includes(userId);
      if (hasReacted) {
        newReactions[emoji] = newReactions[emoji].filter(id => id !== userId);
        if (newReactions[emoji].length === 0) {
          delete newReactions[emoji];
        }
      } else {
        newReactions[emoji].push(userId);
      }
      
      await publishToChannel(
        `ticket:${ticket.id}:reactions`, 
        `message:${message.id}:reaction`, 
        newReactions
      );
      
      setReactions(newReactions);
    } catch (error) {
      console.error('Error publishing reaction:', error);
    }
  };

  const createMarkup = () => {
    return { __html: message.content || (message.text || '') };
  };

  const getSenderName = () => {
    if (typeof message.sender === 'string') {
      return message.isCustomer ? 
        (typeof ticket.customer === 'string' ? ticket.customer : ticket.customer.name) 
        : message.sender;
    }
    return message.sender.name;
  };

  const isCustomer = message.isCustomer || 
    (typeof message.sender !== 'string' && message.sender.type === 'customer');

  // Get customer name safely
  const customerName = typeof ticket.customer === 'string' 
    ? ticket.customer 
    : ticket.customer.name;

  return (
    <div className="flex gap-3">
      <Avatar className="h-8 w-8">
        <span className="text-xs">
          {isCustomer ? customerName[0] : 'A'}
        </span>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">
            {getSenderName()}
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {new Date(message.timestamp).toLocaleString()}
          </span>
        </div>
        <div 
          className="mt-1 text-sm bg-secondary/20 rounded-lg p-3 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={createMarkup()}
        />
        <div className="mt-1 flex items-center gap-2">
          <div className="flex flex-wrap gap-1">
            {Object.entries(reactions).map(([emoji, users]) => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => handleReaction(emoji)}
              >
                {emoji} {users.length}
              </Button>
            ))}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Smile className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="start">
              <div className="flex gap-1">
                {COMMON_REACTIONS.map((emoji) => (
                  <Button
                    key={emoji}
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => handleReaction(emoji)}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          {!isCustomer && (
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
