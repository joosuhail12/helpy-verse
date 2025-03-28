
import React, { useState, useEffect, useCallback } from 'react';
import { useChat } from '@/hooks/chat/useChat';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import { ChatMessage } from './types';
import { usePaginatedMessages } from '@/hooks/chat/usePaginatedMessages';
import { useOfflineSyncManager } from '@/hooks/chat/useOfflineSyncManager';
import { RateLimiter } from '@/utils/chat/rateLimiter';
import { toast } from 'sonner';

interface ConversationViewProps {
  conversationId: string;
  showAvatars?: boolean;
  onSendMessage?: (content: string, attachments?: File[]) => void;
  encrypted?: boolean;
}

const ConversationView: React.FC<ConversationViewProps> = ({
  conversationId,
  showAvatars = true,
  onSendMessage,
  encrypted = false
}) => {
  const { sendMessage } = useChat();
  const [attachments, setAttachments] = useState<File[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [rateLimiter] = useState(() => new RateLimiter(conversationId));
  
  // Use our new hooks
  const {
    messages,
    isLoading,
    hasMore,
    loadMoreMessages,
    addMessage
  } = usePaginatedMessages({
    conversationId,
    pageSize: 20
  });
  
  const {
    offlineMode,
    queueMessage,
    hasQueuedMessages,
    triggerSync
  } = useOfflineSyncManager(conversationId);
  
  // Check for offline messages and sync when coming online
  useEffect(() => {
    if (!offlineMode && hasQueuedMessages) {
      triggerSync();
    }
  }, [offlineMode, hasQueuedMessages, triggerSync]);

  const handleSendMessage = async (content: string) => {
    // Check rate limiting
    const rateCheck = rateLimiter.canSendMessage();
    if (!rateCheck.allowed) {
      toast.error(rateCheck.reason || 'Too many messages. Please wait before sending again.');
      return;
    }
    
    // Record this message with the rate limiter
    rateLimiter.recordMessage();
    
    if (onSendMessage) {
      onSendMessage(content, attachments);
    } else {
      const message: ChatMessage = {
        id: crypto.randomUUID(),
        content,
        sender: 'user',
        timestamp: new Date().toISOString(),
        status: offlineMode ? 'sending' : 'sent'
      };
      
      // Add locally for immediate feedback
      addMessage(message);
      
      if (offlineMode) {
        // Queue for later if offline
        await queueMessage(message);
      } else {
        // Send normally if online
        await sendMessage(conversationId, content);
      }
    }
    
    setAttachments([]);
  };

  const handleFileUpload = (files: File[]) => {
    setAttachments((prev) => [...prev, ...files]);
  };

  const handleRemoveFile = (file: File) => {
    setAttachments((prev) => prev.filter((f) => f !== file));
  };
  
  // Mock typing indicators for demo purposes
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].sender === 'user') {
      const timeout = setTimeout(() => {
        setTypingUsers(['Agent']);
        
        setTimeout(() => {
          setTypingUsers([]);
        }, 3000);
      }, 1000);
      
      return () => clearTimeout(timeout);
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <MessageList 
        messages={messages} 
        conversationId={conversationId}
        showAvatars={showAvatars}
        encrypted={encrypted}
        isLoading={isLoading}
        hasMore={hasMore}
        onLoadMore={loadMoreMessages}
      />
      
      {typingUsers.length > 0 && (
        <div className="px-4 py-2">
          <TypingIndicator users={typingUsers} />
        </div>
      )}
      
      <MessageInput 
        onSendMessage={handleSendMessage}
        attachments={attachments}
        onFileUpload={handleFileUpload}
        onRemoveFile={handleRemoveFile}
        encrypted={encrypted}
        disabled={isLoading}
        placeholder={offlineMode ? "You're offline. Messages will be sent when you reconnect." : "Type a message..."}
      />
    </div>
  );
};

export default ConversationView;
