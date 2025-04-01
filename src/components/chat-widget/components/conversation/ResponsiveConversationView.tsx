
import React, { useState, useEffect } from 'react';
import { useRealtimeChat } from '@/hooks/chat/useRealtimeChat';
import { useMessageSubscription } from '@/hooks/chat/useMessageSubscription';
import { useTypingIndicator } from '@/hooks/chat/useTypingIndicator';
import ChatHeader from '../header/ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import { ChatMessage } from './types';
import { ChatMessage as StoreChatMessage } from '@/store/slices/chat/types';
import { useChat } from '@/hooks/chat/useChat';
import UserAvatar from '../user/UserAvatar';
import { adaptStoreMessagesToComponentMessages } from '@/utils/messageTypeAdapter';
import { ThemeProvider } from '@/context/ThemeContext';

export interface ResponsiveConversationViewProps {
  conversationId: string;
  workspaceId: string;
  onBack?: () => void;
}

const ResponsiveConversationView: React.FC<ResponsiveConversationViewProps> = ({
  conversationId,
  workspaceId,
  onBack
}) => {
  const { messages: storeMessages, sendMessage, isLoading } = useRealtimeChat(conversationId, workspaceId);
  const [typingUsers, setTypingUsers] = useState<{ clientId: string; name?: string }[]>([]);
  const { getMessages } = useChat();
  const [loadedMessages, setLoadedMessages] = useState<ChatMessage[]>([]);

  // Load messages when component mounts
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const storeMessages = await getMessages(conversationId);
        // Convert store messages to component messages with proper timestamp conversion
        const componentMessages = storeMessages.map(msg => ({
          ...msg,
          timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp)
        }));
        setLoadedMessages(componentMessages as unknown as ChatMessage[]);
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };
    
    loadMessages();
  }, [conversationId, getMessages]);

  // Initialize message subscription
  const { publishMessage } = useMessageSubscription(conversationId, workspaceId, {
    onMessage: (message: ChatMessage) => {
      // Handle new messages if needed
    }
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

  const handleSendMessage = async (content: string) => {
    sendTypingIndicator(false);
    await sendMessage(content);
  };

  const handleMessageInputChange = () => {
    sendTypingIndicator(true);
  };

  // Convert store messages to component messages with proper timestamp handling
  const displayMessages: ChatMessage[] = storeMessages.length > 0 
    ? (storeMessages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp)
      })) as unknown as ChatMessage[])
    : loadedMessages;

  return (
    <ThemeProvider>
      <div className="flex flex-col h-full">
        <ChatHeader 
          title="Conversation" 
          onBackClick={onBack} 
          workspaceId={workspaceId}
          conversationId={conversationId}
        />
        <div className="flex-1 overflow-hidden flex flex-col">
          <MessageList 
            messages={displayMessages} 
            conversationId={conversationId}
            showAvatars={true}
          />
          <div className="px-4 pb-2">
            <TypingIndicator users={activeTypers} agentName={activeTypers.length === 1 ? "Support agent" : undefined} />
            <MessageInput 
              onSendMessage={handleSendMessage}
              onTyping={handleMessageInputChange}
            />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default ResponsiveConversationView;
