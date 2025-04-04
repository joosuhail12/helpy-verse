
import React from 'react';
import { formatMessageTime } from '@/components/chat-widget/utils/messageFormatter';
import { ChatMessage } from './types';
import FileAttachmentList from '@/components/chat-widget/components/message/FileAttachmentList';
import { useThemeContext } from '@/context/ThemeContext';
import { User, Bot } from 'lucide-react';

interface MessageItemProps {
  message: ChatMessage;
  showAvatar?: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, showAvatar = false }) => {
  const { colors } = useThemeContext();
  const isUser = message.sender === 'user';
  
  // Determine message style based on sender
  const messageStyle = isUser 
    ? { 
        backgroundColor: colors.userMessage || '#9b87f5',
        color: colors.userMessageText || 'white'
      } 
    : { 
        backgroundColor: colors.agentMessage || '#f3f4f6',
        color: colors.agentMessageText || '#1f2937'
      };
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {showAvatar && !isUser && (
        <div className="mr-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot size={16} className="text-primary" />
          </div>
        </div>
      )}
      
      <div className="flex flex-col max-w-[80%]">
        <div 
          className={`px-4 py-3 rounded-2xl ${isUser ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}
          style={messageStyle}
        >
          <div className="break-words whitespace-pre-wrap">{message.content}</div>
          
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2">
              <FileAttachmentList attachments={message.attachments} />
            </div>
          )}
        </div>
        
        <div className={`text-xs mt-1 text-gray-400 ${isUser ? 'text-right mr-1' : 'ml-1'}`}>
          {formatMessageTime(message.timestamp)}
        </div>
      </div>
      
      {showAvatar && isUser && (
        <div className="ml-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User size={16} className="text-primary" />
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageItem;
