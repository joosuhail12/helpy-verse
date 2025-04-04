
import React from 'react';
import { formatMessageTime } from '../../utils/messageFormatter';
import { ChatMessage } from '../../types';
import FileAttachmentList from './FileAttachmentList';
import { useThemeContext } from '@/context/ThemeContext';

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
        backgroundColor: colors.userMessage,
        color: colors.userMessageText
      } 
    : { 
        backgroundColor: colors.agentMessage,
        color: colors.agentMessageText
      };
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] rounded-lg px-4 py-2`} style={messageStyle}>
        <div className="flex flex-col">
          <div className="break-words whitespace-pre-wrap">{message.content}</div>
          
          {message.attachments && message.attachments.length > 0 && (
            <FileAttachmentList attachments={message.attachments} />
          )}
          
          <div className="text-xs opacity-75 text-right mt-1">
            {formatMessageTime(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
