
import React, { useMemo, useRef, useEffect } from 'react';
import { format, isToday, isYesterday, isSameDay, isSameWeek, parseISO } from 'date-fns';
import { Loader2 } from 'lucide-react';
import EnhancedMessageItem from './EnhancedMessageItem';
import { useIsMobile } from '@/hooks/use-mobile';
import ConversationDateHeader from '../ConversationDateHeader';
import { Message } from '../types';

interface GroupedMessageListProps {
  messages: Message[];
  loading?: boolean;
  hasMore?: boolean;
  loadMore?: () => void;
  currentUserId: string;
  onReact?: (messageId: string, emoji: string) => void;
  searchResults?: Message[];
}

/**
 * Component to render messages grouped by date with infinite loading
 */
const GroupedMessageList: React.FC<GroupedMessageListProps> = ({
  messages,
  loading = false,
  hasMore = false,
  loadMore,
  currentUserId,
  onReact,
  searchResults
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  
  // Get a set of highlighted message IDs
  const highlightedMessageIds = useMemo(() => {
    if (!searchResults || searchResults.length === 0) return new Set<string>();
    return new Set(searchResults.map(m => m.id));
  }, [searchResults]);
  
  // Group messages by date
  const groupedMessages = useMemo(() => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      try {
        const messageDate = parseISO(message.timestamp);
        let dateLabel = '';
        
        if (isToday(messageDate)) {
          dateLabel = 'Today';
        } else if (isYesterday(messageDate)) {
          dateLabel = 'Yesterday';
        } else if (isSameWeek(messageDate, new Date())) {
          dateLabel = format(messageDate, 'EEEE'); // e.g., "Monday"
        } else {
          dateLabel = format(messageDate, 'MMMM d, yyyy'); // e.g., "January 1, 2023"
        }
        
        if (!groups[dateLabel]) {
          groups[dateLabel] = [];
        }
        
        groups[dateLabel].push(message);
      } catch (error) {
        // If date parsing fails, add message to "Other" group
        if (!groups['Other']) {
          groups['Other'] = [];
        }
        groups['Other'].push(message);
      }
    });
    
    return Object.entries(groups);
  }, [messages]);
  
  // Setup observer for infinite loading
  useEffect(() => {
    if (hasMore && loadMore && loadingRef.current) {
      observerRef.current = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting && !loading) {
            loadMore();
          }
        },
        { threshold: 0.1 }
      );
      
      observerRef.current.observe(loadingRef.current);
    }
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loadMore, loading]);
  
  // Scroll to highlighted message if search results exist
  useEffect(() => {
    if (searchResults && searchResults.length > 0 && listRef.current) {
      const firstHighlightedMessage = listRef.current.querySelector('[data-highlighted="true"]');
      if (firstHighlightedMessage) {
        firstHighlightedMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [searchResults]);
  
  // Render loading indicator
  if (loading && messages.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div ref={listRef} className="space-y-6 px-4 py-6">
      {hasMore && (
        <div 
          ref={loadingRef} 
          className="flex justify-center pb-4"
        >
          {loading && (
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          )}
        </div>
      )}
      
      {groupedMessages.map(([dateLabel, dateMessages]) => (
        <div key={dateLabel} className="space-y-4">
          <ConversationDateHeader date={dateLabel} />
          
          <div className="space-y-4">
            {dateMessages.map((message, index) => {
              const prevMessage = index > 0 ? dateMessages[index - 1] : undefined;
              const nextMessage = index < dateMessages.length - 1 ? dateMessages[index + 1] : undefined;
              
              // Determine if messages are from same sender and close in time
              const isGroupedWithPrev = prevMessage && 
                prevMessage.sender === message.sender &&
                isSameDay(parseISO(prevMessage.timestamp), parseISO(message.timestamp)) &&
                parseISO(message.timestamp).getTime() - parseISO(prevMessage.timestamp).getTime() < 300000; // 5 min
              
              const isGroupedWithNext = nextMessage && 
                nextMessage.sender === message.sender &&
                isSameDay(parseISO(nextMessage.timestamp), parseISO(message.timestamp)) &&
                parseISO(nextMessage.timestamp).getTime() - parseISO(message.timestamp).getTime() < 300000; // 5 min
              
              // Skip spacing if messages are from same sender and close in time
              if (isGroupedWithPrev) {
                return (
                  <div 
                    key={message.id} 
                    className="mt-1" 
                    data-highlighted={highlightedMessageIds.has(message.id) ? 'true' : 'false'}
                  >
                    <EnhancedMessageItem
                      message={message}
                      isCurrentUser={message.sender === 'user'}
                      previousMessage={prevMessage}
                      nextMessage={nextMessage}
                      isMobile={isMobile}
                      onReact={onReact}
                      isHighlighted={highlightedMessageIds.has(message.id)}
                    />
                  </div>
                );
              }
              
              return (
                <div 
                  key={message.id}
                  data-highlighted={highlightedMessageIds.has(message.id) ? 'true' : 'false'}
                >
                  <EnhancedMessageItem
                    message={message}
                    isCurrentUser={message.sender === 'user'}
                    previousMessage={prevMessage}
                    nextMessage={nextMessage}
                    isMobile={isMobile}
                    onReact={onReact}
                    isHighlighted={highlightedMessageIds.has(message.id)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}
      
      {messages.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-10">
          <p className="text-gray-500 text-sm">No messages yet</p>
          <p className="text-gray-400 text-xs mt-1">Start a conversation</p>
        </div>
      )}
    </div>
  );
};

export default GroupedMessageList;
