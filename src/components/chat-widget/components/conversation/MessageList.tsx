
import React, { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';
import { ChatMessage } from './types';

interface MessageListProps {
  messages: ChatMessage[];
  conversationId?: string;
  showAvatars?: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages,
  conversationId,
  showAvatars = false
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages come in
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Group messages by sender and consecutive time (within 2 minutes)
  const groupedMessages = messages.reduce((groups: ChatMessage[][], message, index) => {
    // Start a new group if this is the first message
    if (index === 0) {
      return [[message]];
    }

    const lastGroup = groups[groups.length - 1];
    const lastMessage = lastMessage = lastGroup[lastGroup.length - 1];
    
    // Conditions for grouping messages together:
    // 1. Same sender
    // 2. Time difference less than 2 minutes (120,000 ms)
    const sameUser = lastMessage.sender === message.sender;
    const timeDiff = typeof message.timestamp === 'string'
      ? new Date(message.timestamp).getTime() - new Date(lastMessage.timestamp).getTime()
      : message.timestamp.getTime() - lastMessage.timestamp.getTime();
    
    const closeInTime = timeDiff < 120000; // 2 minutes
    
    if (sameUser && closeInTime) {
      // Add to existing group
      lastGroup.push(message);
    } else {
      // Start new group
      groups.push([message]);
    }
    
    return groups;
  }, []);

  return (
    <div className="flex flex-col space-y-2 p-2">
      {groupedMessages.map((group, groupIndex) => (
        <div key={`group-${groupIndex}`} className="message-group">
          {group.map((message, messageIndex) => (
            <MessageItem
              key={message.id}
              message={message}
              showAvatar={showAvatars && messageIndex === group.length - 1}
              isFirstInGroup={messageIndex === 0}
              isLastInGroup={messageIndex === group.length - 1}
            />
          ))}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
