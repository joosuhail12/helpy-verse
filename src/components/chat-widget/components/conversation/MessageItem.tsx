
import React from 'react';
import { format } from 'date-fns';
import { Message } from './types';
import { UserCircle } from 'lucide-react';

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUserMessage = message.sender === 'user';
  const timestamp = typeof message.timestamp === 'string' 
    ? new Date(message.timestamp) 
    : message.timestamp;

  return (
    <div className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start max-w-[80%] ${isUserMessage ? 'flex-row-reverse' : ''}`}>
        <div className={`flex-shrink-0 ${isUserMessage ? 'ml-2' : 'mr-2'}`}>
          {!isUserMessage ? (
            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center">
              <span className="text-xs font-bold">A</span>
            </div>
          ) : (
            <UserCircle className="w-8 h-8 text-gray-400" />
          )}
        </div>
        
        <div>
          <div 
            className={`rounded-lg p-3 ${
              isUserMessage 
                ? 'bg-primary text-white rounded-tr-none' 
                : 'bg-gray-100 text-gray-800 rounded-tl-none'
            }`}
          >
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          </div>
          
          <div className={`text-xs text-gray-500 mt-1 ${isUserMessage ? 'text-right' : 'text-left'}`}>
            {format(timestamp, 'h:mm a')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
