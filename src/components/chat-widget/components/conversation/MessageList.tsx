
import React, { useRef, useEffect } from 'react';
import { ChatMessage } from './types';
import { formatRelativeTime } from '@/utils/helpers/formatters';
import { useThemeContext } from '@/context/ThemeContext';
import { FileIcon, Download, Paperclip } from 'lucide-react';
import FileAttachmentItem from './FileAttachmentItem';
import UserAvatar from '../user/UserAvatar';
import dayjs from 'dayjs';

interface MessageListProps {
  messages: ChatMessage[];
  conversationId: string;
  showAvatars?: boolean;
  encrypted?: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, conversationId, showAvatars = false, encrypted = false }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { colors } = useThemeContext();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const groupMessagesByTime = (messages: ChatMessage[]) => {
    const groupedMessages: ChatMessage[][] = [];
    let currentGroup: ChatMessage[] = [];
  
    messages.forEach((message, index) => {
      currentGroup.push(message);
  
      if (
        index === messages.length - 1 ||
        !dayjs(message.timestamp).isSame(messages[index + 1].timestamp, 'day')
      ) {
        groupedMessages.push(currentGroup);
        currentGroup = [];
      }
    });
  
    return groupedMessages;
  };

  const formatMessageGroupTime = (date: Date) => {
    return dayjs(date).format('MMMM D, YYYY');
  };

  const groupedMessages = groupMessagesByTime(messages);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {groupedMessages.map((group, idx) => {
        const groupTimeFormatted = formatMessageGroupTime(new Date(group[0].timestamp));

        return (
          <div 
            key={dayjs(group[0].timestamp).format('YYYYMMDD') + idx} 
            className="mb-4 space-y-2"
          >
            <div 
              className="text-xs text-center mb-2 px-2 py-1 rounded-full bg-gray-100 inline-block mx-auto"
              style={{ color: colors.foreground, backgroundColor: colors.backgroundSecondary }}
            >
              {groupTimeFormatted}
            </div>
            {group.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'items-start'}`}
              >
                {message.sender !== 'user' && showAvatars && (
                  <UserAvatar name="Support Agent" />
                )}
                <div
                  className={`rounded-xl px-3 py-2 ${message.sender === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'} max-w-[75%] sm:max-w-[60%] break-words`}
                  style={{
                    backgroundColor: message.sender === 'user' ? colors.userMessage : colors.agentMessage,
                    color: message.sender === 'user' ? colors.userMessageText : colors.agentMessageText,
                  }}
                >
                  <p className="text-sm">{message.content}</p>
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2">
                      {message.attachments.map((file) => (
                        <FileAttachmentItem key={file.id} file={file} />
                      ))}
                    </div>
                  )}
                  <div className="text-xs mt-1 opacity-70">
                    {formatRelativeTime(message.timestamp)}
                    {message.status && (
                      <span className="ml-1">
                        {message.status === 'sending' && 'Sending...'}
                        {message.status === 'sent' && 'Sent'}
                        {message.status === 'delivered' && 'Delivered'}
                        {message.status === 'read' && 'Read'}
                        {message.status === 'failed' && 'Failed'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
