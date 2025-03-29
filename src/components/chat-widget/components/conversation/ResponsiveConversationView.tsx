
import React, { useState, useEffect, useRef, memo, useMemo } from 'react';
import { useRealtimeChat } from '@/hooks/chat/useRealtimeChat';
import { useMessageSubscription } from '@/hooks/chat/useMessageSubscription';
import { useTypingIndicator } from '@/hooks/chat/useTypingIndicator';
import ChatHeader from '../header/ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import { ChatMessage } from './types';
import { useChat } from '@/hooks/chat/useChat';
import UserAvatar from '../user/UserAvatar';
import { useStableCallback, useStableValue } from '@/utils/performance/reactOptimizations';
import { useRenderTime } from '@/hooks/usePerformanceOptimization';

export interface ResponsiveConversationViewProps {
  conversationId: string;
  workspaceId: string;
  onBack?: () => void;
}

// Memoize the inner components to avoid unnecessary re-renders
const MemoizedMessageList = memo(MessageList);
const MemoizedTypingIndicator = memo(TypingIndicator);
const MemoizedMessageInput = memo(MessageInput);

const ResponsiveConversationView: React.FC<ResponsiveConversationViewProps> = ({
  conversationId,
  workspaceId,
  onBack
}) => {
  // Track render time in development
  useRenderTime('ResponsiveConversationView');
  
  const { messages, sendMessage, isLoading } = useRealtimeChat(conversationId, workspaceId);
  const [typingUsers, setTypingUsers] = useState<{ clientId: string; name?: string }[]>([]);
  const { getMessages } = useChat();
  const [loadedMessages, setLoadedMessages] = useState<ChatMessage[]>([]);

  // Reference to scroll container
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages when component mounts
  useEffect(() => {
    const loadMessages = async () => {
      const msgs = await getMessages(conversationId);
      setLoadedMessages(msgs);
    };
    
    loadMessages();
  }, [conversationId, getMessages]);

  // Initialize message subscription
  const { publishMessage } = useMessageSubscription(conversationId, workspaceId, {
    onMessage: useStableCallback((message: ChatMessage) => {
      // Handle new messages if needed
    }, [])
  });

  // Initialize typing indicator
  const { typingUsers: activeTypers, sendTypingIndicator } = useTypingIndicator(conversationId);

  useEffect(() => {
    // Subscribe to typing status updates
    const handleTypingStatusChanged = (typingStatuses: Record<string, boolean>) => {
      setTypingUsers(
        Object.entries(typingStatuses)
          .filter(([_, isTyping]) => isTyping)
          .map(([clientId]) => ({ clientId }))
      );
    };
    
    // Set up typing indicator listener
    // This would typically be handled by the useTypingIndicator hook
    return () => {
      // Cleanup typing indicator listener
    };
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTypers]);

  // Create stable callbacks for message actions
  const handleSendMessage = useStableCallback(async (content: string) => {
    sendTypingIndicator(false);
    await sendMessage(content);
  }, [sendMessage, sendTypingIndicator]);

  const handleMessageInputChange = useStableCallback(() => {
    sendTypingIndicator(true);
  }, [sendTypingIndicator]);

  // Combine real-time messages with loaded messages - only recompute when necessary
  const displayMessages = useStableValue(() => {
    return messages.length > 0 ? messages : loadedMessages;
  }, [messages, loadedMessages]);

  // Memoize the title to prevent unnecessary re-renders
  const headerTitle = useMemo(() => 
    `Conversation ${conversationId.substring(0, 8)}`, 
    [conversationId]
  );

  return (
    <div className="flex flex-col h-full">
      <ChatHeader 
        title={headerTitle} 
        onBackClick={onBack} 
        workspaceId={workspaceId}
        conversationId={conversationId}
      />
      <div className="flex-1 overflow-hidden flex flex-col">
        <MemoizedMessageList 
          messages={displayMessages} 
          conversationId={conversationId}
          showAvatars={true}
        />
        <div className="px-4 pb-2">
          <MemoizedTypingIndicator 
            users={activeTypers} 
            agentName={activeTypers.length === 1 ? "Support agent" : undefined} 
          />
          <div ref={messagesEndRef} />
          <MemoizedMessageInput 
            onSendMessage={handleSendMessage}
            onTyping={handleMessageInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(ResponsiveConversationView);
