
import React, { useRef, useEffect } from 'react';
import { formatRelativeTime } from '@/utils/helpers/formatters';
import { useThemeContext } from '@/context/ThemeContext';
import FileAttachmentItem from './FileAttachmentItem';
import UserAvatar from '../user/UserAvatar';
import { ChatMessage } from './types';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import * as dayjs from 'dayjs';

interface MessageListProps {
  messages: ChatMessage[];
  conversationId: string;
  showAvatars?: boolean;
  encrypted?: boolean;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  conversationId,
  showAvatars = false,
  encrypted = false,
  isLoading = false,
  hasMore = false,
  onLoadMore
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { colors } = useThemeContext();
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  
  useEffect(() => {
    // Only scroll to bottom on new messages, not when loading old ones
    if (!isLoading && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, isLoading]);
  
  const groupMessagesByTime = (messages: ChatMessage[]) => {
    const groupedMessages = [];
    let currentGroup = [];
    
    messages.forEach((message, index) => {
      currentGroup.push(message);
      
      if (index === messages.length - 1 || 
          !dayjs.default(message.timestamp).isSame(dayjs.default(messages[index + 1].timestamp), 'day')) {
        groupedMessages.push(currentGroup);
        currentGroup = [];
      }
    });
    
    return groupedMessages;
  };
  
  const formatMessageGroupTime = (date: Date | string) => {
    return dayjs.default(date).format('MMMM D, YYYY');
  };
  
  const groupedMessages = groupMessagesByTime(messages);
  
  // Use fallback colors if theme doesn't provide them
  const outgoingMessage = colors.outgoingMessage || colors.userMessage || colors.primary || '#4F46E5';
  const incomingMessage = colors.incomingMessage || colors.agentMessage || colors.backgroundSecondary || '#f3f4f6';
  const outgoingMessageForeground = colors.outgoingMessageForeground || colors.userMessageText || colors.primaryForeground || '#ffffff';
  const incomingMessageForeground = colors.incomingMessageForeground || colors.agentMessageText || colors.foreground || '#1f2937';
  
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {hasMore && (
        <div className="flex justify-center mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onLoadMore}
            disabled={isLoading}
            className="text-xs"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Loading...
              </>
            ) : (
              'Load older messages'
            )}
          </Button>
        </div>
      )}
      
      {groupedMessages.map((group, idx) => {
        const groupTimeFormatted = formatMessageGroupTime(new Date(group[0].timestamp));
        
        return (
          <div 
            key={dayjs.default(group[0].timestamp).format('YYYYMMDD') + idx} 
            className="mb-4 space-y-2"
          >
            <div 
              className="text-xs text-center mb-2 px-2 py-1 rounded-full bg-gray-100 inline-block mx-auto"
              style={{ 
                color: colors.foreground,
                backgroundColor: colors.backgroundSecondary
              }}
            >
              {groupTimeFormatted}
            </div>
            
            {group.map(message => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'items-start'}`}
              >
                {message.sender !== 'user' && showAvatars && (
                  <UserAvatar name="Support Agent" />
                )}
                
                <div 
                  className={`rounded-xl px-3 py-2 ${
                    message.sender === 'user' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800'
                  } max-w-[75%] sm:max-w-[60%] break-words`}
                  style={{
                    backgroundColor: message.sender === 'user' 
                      ? outgoingMessage
                      : incomingMessage,
                    color: message.sender === 'user' 
                      ? outgoingMessageForeground
                      : incomingMessageForeground
                  }}
                >
                  <p className="text-sm">{message.content}</p>
                  
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2">
                      {message.attachments.map(file => (
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
