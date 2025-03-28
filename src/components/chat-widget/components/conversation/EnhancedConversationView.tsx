
import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@/hooks/chat/useChat';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import MessageSearch from './MessageSearch';
import { ChatMessage } from './types';
import { useRateLimiter } from '@/utils/chat/rateLimiter';

interface EnhancedConversationViewProps {
  conversationId: string;
  showSearch?: boolean;
  showAttachments?: boolean;
  showReactions?: boolean;
  showReadReceipts?: boolean;
  encrypted?: boolean;
  virtualized?: boolean;
}

const EnhancedConversationView: React.FC<EnhancedConversationViewProps> = ({
  conversationId,
  showSearch = false,
  showAttachments = true,
  showReactions = false,
  showReadReceipts = false,
  encrypted = false,
  virtualized = true,
}) => {
  const { messages, sendMessage, isLoading } = useChat(conversationId, encrypted);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const [currentResult, setCurrentResult] = useState(0);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messageListRef = useRef<HTMLDivElement>(null);
  
  // Rate limiter for message sending
  const rateLimiter = useRateLimiter({
    maxAttempts: 5,
    timeWindow: 10000, // 10 seconds
    resetAfter: 30000, // 30 seconds
  });

  // Filter messages based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setCurrentResult(0);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = messages
      .map((msg, index) => (msg.content.toLowerCase().includes(query) ? index : -1))
      .filter(index => index !== -1);

    setSearchResults(results);
    setCurrentResult(0);

    // Scroll to first result if there are any
    if (results.length > 0) {
      scrollToMessage(results[0]);
    }
  }, [searchQuery, messages]);

  // Handle message sending
  const handleSendMessage = async (content: string, attachments?: File[]) => {
    // Check rate limiting
    if (rateLimiter.isLimited()) {
      // Show rate limit message - we could display this in UI
      console.warn(`Rate limit reached. Please wait ${Math.ceil(rateLimiter.getRateLimitTimeRemaining() / 1000)} seconds.`);
      return;
    }

    // Register this action with the rate limiter
    rateLimiter.checkAction();

    // Send the message
    await sendMessage(content, encrypted);
  };

  // Navigate between search results
  const navigateSearch = (direction: 'next' | 'prev') => {
    if (searchResults.length === 0) return;

    let newIndex;
    if (direction === 'next') {
      newIndex = (currentResult + 1) % searchResults.length;
    } else {
      newIndex = (currentResult - 1 + searchResults.length) % searchResults.length;
    }

    setCurrentResult(newIndex);
    scrollToMessage(searchResults[newIndex]);
  };

  // Scroll to a specific message
  const scrollToMessage = (index: number) => {
    const messageElement = document.getElementById(`message-${index}`);
    if (messageElement && messageListRef.current) {
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Highlight the message temporarily
      messageElement.classList.add('bg-yellow-100');
      setTimeout(() => {
        messageElement.classList.remove('bg-yellow-100');
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {showSearch && (
        <MessageSearch
          value={searchQuery}
          onChange={setSearchQuery}
          resultCount={searchResults.length}
          currentResult={currentResult}
          onNavigate={navigateSearch}
        />
      )}
      
      <div className="flex-1 overflow-hidden" ref={messageListRef}>
        <MessageList
          messages={messages}
          typingUsers={typingUsers}
          useVirtualization={virtualized}
          showReactions={showReactions}
          showReadReceipts={showReadReceipts}
        />
      </div>
      
      <MessageInput
        onSendMessage={handleSendMessage}
        disabled={isLoading}
        encrypted={encrypted}
        showAttachments={showAttachments}
        isRateLimited={rateLimiter.isLimited()}
        rateLimitTimeRemaining={rateLimiter.getRateLimitTimeRemaining()}
      />
    </div>
  );
};

export default EnhancedConversationView;
