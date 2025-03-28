
import React, { useState, useCallback } from 'react';
import { useChat } from '@/hooks/chat/useChat';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import MessageSearch from './MessageSearch';
import { ChatMessage } from './types';
import { usePaginatedMessages } from '@/hooks/chat/usePaginatedMessages';
import { useOfflineSyncManager } from '@/hooks/chat/useOfflineSyncManager';
import { RateLimiter } from '@/utils/chat/rateLimiter';
import { toast } from 'sonner';

interface EnhancedConversationViewProps {
  conversationId: string;
  showSearch?: boolean;
  showAttachments?: boolean;
  showReactions?: boolean;
  showReadReceipts?: boolean;
  encrypted?: boolean;
}

const EnhancedConversationView: React.FC<EnhancedConversationViewProps> = ({
  conversationId,
  showSearch = false,
  showAttachments = true,
  showReactions = false,
  showReadReceipts = true,
  encrypted = false
}) => {
  const { sendMessage } = useChat();
  const [searchResults, setSearchResults] = useState<ChatMessage[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [rateLimiter] = useState(() => new RateLimiter(conversationId));

  // Use our pagination hook
  const {
    messages,
    isLoading,
    hasMore,
    loadMoreMessages,
    addMessage
  } = usePaginatedMessages({
    conversationId,
    pageSize: 15
  });
  
  // Use offline sync manager
  const { offlineMode, queueMessage } = useOfflineSyncManager(conversationId);

  const handleSearch = useCallback((query: string) => {
    if (!query) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Basic search implementation
    const results = messages.filter(message => 
      message.content.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(results);
  }, [messages]);

  const handleSendMessage = useCallback(async (content: string, attachments?: File[]) => {
    // Check rate limiting
    const rateCheck = rateLimiter.canSendMessage();
    if (!rateCheck.allowed) {
      toast.error(rateCheck.reason || 'Too many messages. Please wait before sending again.');
      return;
    }
    
    // Record this message with the rate limiter
    rateLimiter.recordMessage();
    
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      content,
      sender: 'user',
      timestamp: new Date().toISOString(),
      status: offlineMode ? 'sending' : 'sent',
      attachments: attachments?.map(file => ({
        id: crypto.randomUUID(),
        name: file.name,
        url: URL.createObjectURL(file),
        size: file.size,
        type: file.type
      }))
    };
    
    // Add locally for immediate feedback
    addMessage(message);
    
    if (offlineMode) {
      // Queue for later if offline
      await queueMessage(message);
    } else {
      // Send normally if online
      await sendMessage(conversationId, content, attachments);
    }
  }, [addMessage, conversationId, offlineMode, queueMessage, rateLimiter, sendMessage]);

  return (
    <div className="flex flex-col h-full">
      {showSearch && (
        <div className="border-b p-2">
          <MessageSearch onSearch={handleSearch} />
        </div>
      )}
      
      <MessageList 
        messages={isSearching ? searchResults : messages} 
        conversationId={conversationId}
        isLoading={isLoading}
        hasMore={!isSearching && hasMore}
        onLoadMore={loadMoreMessages}
      />
      
      <MessageInput 
        onSendMessage={handleSendMessage}
        showAttachments={showAttachments}
        encrypted={encrypted}
        disabled={isLoading}
        placeholder={offlineMode ? "You're offline. Messages will be sent when you reconnect." : "Type a message..."}
      />
    </div>
  );
};

export default EnhancedConversationView;
