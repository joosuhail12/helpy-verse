
import React, { useRef, useEffect } from 'react';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';
import { formatRelativeTime } from '@/utils/helpers/formatters';
import { useThemeContext } from '@/context/ThemeContext';
import FileAttachmentItem from './FileAttachmentItem';
import UserAvatar from '../user/UserAvatar';
import { ChatMessage } from './types';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import dayjs from 'dayjs';

interface VirtualizedMessageListProps {
  messages: ChatMessage[];
  conversationId: string;
  showAvatars?: boolean;
  encrypted?: boolean;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

const VirtualizedMessageList: React.FC<VirtualizedMessageListProps> = ({
  messages,
  conversationId,
  showAvatars = false,
  encrypted = false,
  isLoading = false,
  hasMore = false,
  onLoadMore
}) => {
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const { colors } = useThemeContext();
  
  // Group messages by date for day separators
  const groupedMessagesByDay = React.useMemo(() => {
    const groups: {date: string, messages: ChatMessage[]}[] = [];
    let currentDate = '';
    let currentMessages: ChatMessage[] = [];
    
    messages.forEach((message) => {
      const messageDate = dayjs(message.timestamp).format('YYYY-MM-DD');
      
      if (messageDate !== currentDate) {
        if (currentMessages.length > 0) {
          groups.push({
            date: currentDate,
            messages: [...currentMessages]
          });
        }
        currentDate = messageDate;
        currentMessages = [message];
      } else {
        currentMessages.push(message);
      }
    });
    
    if (currentMessages.length > 0) {
      groups.push({
        date: currentDate,
        messages: [...currentMessages]
      });
    }
    
    return groups;
  }, [messages]);

  // Flatten messages with date separators for virtualization
  const flatItems = React.useMemo(() => {
    const items: (ChatMessage | { id: string, type: 'date-separator', date: string })[] = [];
    
    groupedMessagesByDay.forEach((group) => {
      if (group.date) {
        items.push({
          id: `date-${group.date}`,
          type: 'date-separator',
          date: group.date
        });
      }
      items.push(...group.messages);
    });
    
    return items;
  }, [groupedMessagesByDay]);
  
  // Scroll to bottom on new messages
  useEffect(() => {
    if (!isLoading && messages.length > 0 && virtuosoRef.current) {
      virtuosoRef.current.scrollToIndex({
        index: flatItems.length - 1,
        behavior: 'smooth'
      });
    }
  }, [isLoading, messages.length, flatItems.length]);
  
  // Message style colors with fallbacks
  const outgoingMessage = colors.outgoingMessage || colors.userMessage || colors.primary || '#4F46E5';
  const incomingMessage = colors.incomingMessage || colors.agentMessage || colors.backgroundSecondary || '#f3f4f6';
  const outgoingMessageForeground = colors.outgoingMessageForeground || colors.userMessageText || colors.primaryForeground || '#ffffff';
  const incomingMessageForeground = colors.incomingMessageForeground || colors.agentMessageText || colors.foreground || '#1f2937';
  
  // Render each item (message or date separator)
  const renderItem = (index: number, item: any) => {
    // Render date separator
    if (item.type === 'date-separator') {
      return (
        <div className="text-xs text-center my-2 px-2 py-1 rounded-full bg-gray-100 inline-block mx-auto"
          style={{ 
            color: colors.foreground,
            backgroundColor: colors.backgroundSecondary
          }}>
          {dayjs(item.date).format('MMMM D, YYYY')}
        </div>
      );
    }
    
    // Render message
    const message = item as ChatMessage;
    return (
      <div 
        key={message.id} 
        className={`flex ${message.sender === 'user' ? 'justify-end' : 'items-start'} mb-2`}
      >
        {message.sender !== 'user' && showAvatars && (
          <UserAvatar name="Support Agent" />
        )}
        
        <div 
          className={`rounded-xl px-3 py-2 max-w-[75%] sm:max-w-[60%] break-words`}
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
    );
  };
  
  // Load more messages header component
  const Header = hasMore ? () => (
    <div className="flex justify-center p-2">
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
  ) : undefined;

  return (
    <div className="flex-1 relative">
      {messages.length === 0 && isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Virtuoso
          ref={virtuosoRef}
          style={{ height: '100%', width: '100%' }}
          data={flatItems}
          totalCount={flatItems.length}
          itemContent={renderItem}
          components={{ Header }}
          initialTopMostItemIndex={flatItems.length - 1}
          followOutput="smooth"
          className="p-4"
        />
      )}
    </div>
  );
};

export default VirtualizedMessageList;
