
import React from 'react';
import { cn } from '@/lib/utils';
import { Message } from '../ResponsiveConversationView';

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isCurrentUser }) => {
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div
      className={cn(
        "flex",
        isCurrentUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[70%] rounded-lg px-4 py-2 text-sm",
          isCurrentUser 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted"
        )}
      >
        <div className="break-words">{message.content}</div>
        <div 
          className={cn(
            "text-xs mt-1",
            isCurrentUser 
              ? "text-primary-foreground/70" 
              : "text-muted-foreground"
          )}
        >
          {formattedTime}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
