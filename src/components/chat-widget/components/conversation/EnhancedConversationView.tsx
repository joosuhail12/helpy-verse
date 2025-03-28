
import React, { useState, useRef, useEffect } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import MessageSearch from './MessageSearch';
import { useChat } from '@/hooks/chat/useChat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import { useRateLimiter } from '@/utils/chat/rateLimiter';

export interface EnhancedConversationViewProps {
  conversationId: string;
  showSearch?: boolean;
  showAttachments?: boolean;
  showReactions?: boolean;
  showReadReceipts?: boolean;
  encrypted?: boolean;
  virtualized?: boolean;
}

export function EnhancedConversationView({
  conversationId,
  showSearch = false,
  showAttachments = true,
  showReactions = false,
  showReadReceipts = true,
  encrypted = false,
  virtualized = false
}: EnhancedConversationViewProps) {
  const {
    messages,
    isLoading,
    typingUsers,
    sendMessage,
    notifyTyping
  } = useChat(conversationId);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(-1);
  const conversationRef = useRef<HTMLDivElement>(null);
  
  const { isRateLimited, getRemainingTime, checkRateLimit } = useRateLimiter({
    maxMessages: 5,
    timeWindowMs: 10000, // 10 seconds
  });

  // Search functionality
  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([]);
      setCurrentResultIndex(-1);
      return;
    }
    
    const results = messages
      .map((msg, index) => {
        if (msg.content.toLowerCase().includes(searchTerm.toLowerCase())) {
          return index;
        }
        return -1;
      })
      .filter(index => index !== -1);
    
    setSearchResults(results);
    setCurrentResultIndex(results.length > 0 ? 0 : -1);
  }, [searchTerm, messages]);

  // Handle sending a message
  const handleSendMessage = (content: string, attachments: File[] = []) => {
    // Check rate limiting
    const rateCheck = checkRateLimit();
    
    if (rateCheck === false) {
      // User is rate limited, don't send message
      return;
    }
    
    sendMessage(content, attachments);
  };

  // Navigate search results
  const navigateSearch = (direction: 'next' | 'prev') => {
    if (searchResults.length === 0) return;
    
    if (direction === 'next') {
      setCurrentResultIndex(prev => 
        prev < searchResults.length - 1 ? prev + 1 : 0
      );
    } else {
      setCurrentResultIndex(prev => 
        prev > 0 ? prev - 1 : searchResults.length - 1
      );
    }
  };

  // Scroll to search result
  useEffect(() => {
    if (currentResultIndex >= 0 && searchResults[currentResultIndex] !== undefined) {
      const messageElements = conversationRef.current?.querySelectorAll('.message-item');
      if (messageElements && messageElements[searchResults[currentResultIndex]]) {
        messageElements[searchResults[currentResultIndex]].scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  }, [currentResultIndex, searchResults]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" ref={conversationRef}>
      {showSearch && (
        <MessageSearch
          value={searchTerm}
          onChange={setSearchTerm}
          resultCount={searchResults.length}
          currentResult={currentResultIndex + 1}
          onNavigate={navigateSearch}
        />
      )}
      
      <MessageList
        messages={messages}
        typingUsers={typingUsers}
        useVirtualization={virtualized}
        showReactions={showReactions}
        showReadReceipts={showReadReceipts}
      />
      
      <MessageInput
        onSendMessage={handleSendMessage}
        onTyping={notifyTyping}
        encrypted={encrypted}
        showAttachments={showAttachments}
        isRateLimited={!!isRateLimited && isRateLimited()}
        rateLimitTimeRemaining={getRemainingTime ? getRemainingTime() : 0}
      />
    </div>
  );
}
