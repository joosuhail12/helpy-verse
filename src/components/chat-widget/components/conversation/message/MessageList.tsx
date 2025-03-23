
import React from 'react';
import MessageItem from './MessageItem';
import { Message } from '../ResponsiveConversationView';

export interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId }) => {
  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full py-8 text-gray-500 text-sm">
        No messages yet. Start the conversation!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          isCurrentUser={message.userId === currentUserId}
        />
      ))}
    </div>
  );
};

export default MessageList;
