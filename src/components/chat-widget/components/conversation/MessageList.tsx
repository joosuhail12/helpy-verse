
import React from 'react';
import { Message } from './types';
import MessageItem from './MessageItem';
import { AlertCircle, Loader2 } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  error: Error | null;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full p-4">
        <Loader2 className="animate-spin h-6 w-6 text-primary mr-2" />
        <p>Loading messages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-500 p-4 rounded-md flex items-start">
        <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium">Error loading messages</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500">
        <p>No messages yet. Start a conversation!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <MessageItem 
          key={message.id}
          message={message}
        />
      ))}
    </div>
  );
};

export default MessageList;
