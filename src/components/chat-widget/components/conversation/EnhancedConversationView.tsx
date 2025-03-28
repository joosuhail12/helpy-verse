
import React, { useState, useCallback } from 'react';
import { useChat } from '@/hooks/chat/useChat';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import MessageSearch from './MessageSearch';
import { ChatMessage, EnhancedConversationViewProps } from './types';
import { usePaginatedMessages } from '@/hooks/chat/usePaginatedMessages';
import { useOfflineSyncManager } from '@/hooks/chat/useOfflineSyncManager';
import { RateLimiter } from '@/utils/chat/rateLimiter';
import { toast } from 'sonner';

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
  const [attachments, setAttachments] = useState<File[]>([]);

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

  const handleSendMessage = useCallback(async (content: string) => {
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
      conversationId,
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
    
    // Clear attachments after sending
    setAttachments([]);
  }, [addMessage, attachments, conversationId, offlineMode, queueMessage, rateLimiter, sendMessage]);

  const handleFileUpload = (files: File[]) => {
    setAttachments((prev) => [...prev, ...files]);
  };

  const handleRemoveFile = (file: File) => {
    setAttachments((prev) => prev.filter((f) => f !== file));
  };

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
        // Auto-enable virtualization for large message lists
        useVirtualization={messages.length > 50}
      />
      
      <MessageInput 
        onSendMessage={handleSendMessage}
        encrypted={encrypted}
        disabled={isLoading}
        placeholder={offlineMode ? "You're offline. Messages will be sent when you reconnect." : "Type a message..."}
        attachments={attachments}
        onFileUpload={handleFileUpload}
        onRemoveFile={handleRemoveFile}
        isRateLimited={rateCheck => !rateCheck.allowed}
        rateLimitTimeRemaining={rateCheck => rateCheck.retryAfterMs || 0}
      />
    </div>
  );
};

export default EnhancedConversationView;
