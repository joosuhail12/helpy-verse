import React, { useState, useEffect } from 'react';
import { Avatar } from "@/components/ui/avatar";
import { Check, CheckCheck, Clock, Smile } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { getAblyChatRoom } from '@/utils/ably';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import EmojiPicker from 'emoji-picker-react';
import type { Message } from './types';
import type { Ticket } from '@/types/ticket';

interface MessageItemProps {
  message: Message;
  ticket: Ticket;
  onReply: (content: string) => void;
}

const COMMON_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

const MessageItem = ({ message, ticket }: MessageItemProps) => {
  // Commented out reactions state and functionality
  /* 
  const [reactions, setReactions] = useState<Record<string, string[]>>(message.reactions || {});
  const [isLoadingReactions, setIsLoadingReactions] = useState(false);

  useEffect(() => {
    let isComponentMounted = true;
    let roomInstance: any;

    const setupReactions = async () => {
      setIsLoadingReactions(true);
      try {
        const room = await getAblyChatRoom(`ticket:${ticket.id}`);
        roomInstance = room;

        // Make sure room is attached
        if (!room || room.status !== 'attached') {
          try {
            await room.attach();
          } catch (err) {
            console.error('Error attaching to room for reactions:', err);
            return;
          }
        }

        // Check if reactions feature is available
        if (!room.reactions) {
          console.warn('Reactions feature not available in current Ably Chat version');
          setIsLoadingReactions(false);
          return;
        }

        try {
          // For v0.5.1, reactions API is different
          // Attempt to subscribe using message.id as the event name
          const underlying = (room as any)._ably?.channels?.get?.((room as any).id);

          if (!underlying) {
            console.error('Could not access underlying Ably channel');
            return;
          }

          // Use the underlying channel to set up a custom event for reactions
          // with a format like 'reaction:messageId'
          const reactionChannel = `reaction:${message.id}`;

          underlying.subscribe(reactionChannel, (msg: any) => {
            if (!isComponentMounted) return;

            // Update reactions based on the received message
            if (msg.data && msg.data.reactions) {
              setReactions(msg.data.reactions);
            }
          });

          // Attempt to get initial reactions if any are stored
          // This part is implementation-specific as Ably Chat v0.5.1 doesn't have
          // a built-in reactions.get method
          underlying.history({ limit: 1, untilAttach: true }, (err: any, result: any) => {
            if (err) {
              console.error('Error fetching reaction history:', err);
              return;
            }

            const items = result?.items || [];
            for (const item of items) {
              if (item.name === reactionChannel && item.data?.reactions) {
                setReactions(item.data.reactions);
                break;
              }
            }
          });
        } catch (err) {
          console.error('Error setting up custom reactions:', err);
        }

        setIsLoadingReactions(false);
      } catch (error) {
        console.error('Error setting up reactions:', error);
        setIsLoadingReactions(false);
      }
    };

    setupReactions();

    return () => {
      isComponentMounted = false;
    };
  }, [message.id, ticket.id]);

  const handleReaction = async (emoji: string) => {
    try {
      const room = await getAblyChatRoom(`ticket:${ticket.id}`);
      const userId = 'Agent'; // In a real app, this would be the actual user ID

      if (!room || room.status !== 'attached') {
        try {
          await room.attach();
        } catch (err) {
          console.error('Error attaching to room for adding reaction:', err);
          return;
        }
      }

      // Check if the reactions feature exists in this version
      if (!room.reactions) {
        // Custom implementation for v0.5.1
        const underlying = (room as any)._ably?.channels?.get?.((room as any).id);

        if (!underlying) {
          console.error('Could not access underlying Ably channel');
          return;
        }

        // Check if user already reacted with this emoji
        const hasReacted = reactions[emoji]?.includes(userId);

        // Update reactions object
        const updatedReactions = { ...reactions };

        if (hasReacted) {
          // Remove the reaction
          if (updatedReactions[emoji]) {
            updatedReactions[emoji] = updatedReactions[emoji].filter(id => id !== userId);
            if (updatedReactions[emoji].length === 0) {
              delete updatedReactions[emoji];
            }
          }
        } else {
          // Add the reaction
          if (!updatedReactions[emoji]) {
            updatedReactions[emoji] = [];
          }
          updatedReactions[emoji].push(userId);
        }

        // Publish the updated reactions
        underlying.publish(`reaction:${message.id}`, {
          reactions: updatedReactions
        });

        // Update local state immediately
        setReactions(updatedReactions);
        return;
      }

      // Original code for newer versions
      // Check if user already reacted with this emoji
      const hasReacted = reactions[emoji]?.includes(userId);

      if (hasReacted) {
        // Remove the reaction
        await room.reactions.remove(message.id, emoji);
      } else {
        // Add the reaction
        await room.reactions.add(message.id, emoji);
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
    }
  };
  */

  const createMarkup = () => {
    return { __html: message.content };
  };

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
        <div
          className="mt-1 text-sm bg-secondary/20 rounded-lg p-3 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={createMarkup()}
        />
        {/* Commented out reactions UI
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
        */}
      </div>
    </div>
  );
};

export default MessageItem;
