
import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@/hooks/chat/useChat';
import { useThemeContext } from '@/context/ThemeContext';
import { useMessageSubscription } from '@/hooks/chat/useMessageSubscription';
import { useTypingIndicator } from '@/hooks/chat/useTypingIndicator';
import ChatHeader from '../header/ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { ChatMessage } from './types';

interface ConversationViewProps {
  conversationId: string;
  workspaceId: string;
  onBack: () => void;
  onClose: () => void;
}

const ConversationView: React.FC<ConversationViewProps> = ({ 
  conversationId,
  workspaceId,
  onBack,
  onClose
}) => {
  const { colors, features } = useThemeContext();
  const { messages, sendMessage, loadingMessages, currentConversation } = useChat();
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Subscribe to new messages using Ably
  const { publishMessage } = useMessageSubscription(
    conversationId,
    workspaceId,
    {
      onMessage: (message: ChatMessage) => {
        setLocalMessages(prev => [...prev, message]);
      }
    }
  );

  // Use typing indicator
  const { 
    typingUsers, 
    sendTypingIndicator, 
    isUserTyping 
  } = useTypingIndicator(conversationId);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [localMessages]);

  // Initialize local messages
  useEffect(() => {
    if (messages && messages.length > 0) {
      setLocalMessages(messages);
    }
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Create a new message
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content,
      sender: 'user',
      timestamp: new Date().toISOString(),
      conversationId,
      status: 'sent'
    };

    // Add to local messages immediately
    setLocalMessages(prev => [...prev, newMessage]);

    // Send through Ably
    await publishMessage(newMessage);

    // Also send through local chat context
    if (sendMessage) {
      await sendMessage(conversationId, content);
    }

    // Reset typing indicator
    if (features.typingIndicator) {
      sendTypingIndicator(false);
    }
  };

  const handleTyping = (isTyping: boolean) => {
    if (features.typingIndicator) {
      sendTypingIndicator(isTyping);
    }
  };

  const conversationTitle = currentConversation?.title || "Conversation";

  return (
    <div 
      className="flex flex-col h-full overflow-hidden"
      style={{ backgroundColor: colors.background }}
    >
      {/* Add the header with back button */}
      <ChatHeader 
        title={conversationTitle} 
        onClose={onClose} 
        onBackClick={onBack}
      />
      
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList 
          messages={localMessages} 
          typingUsers={typingUsers}
          isLoading={loadingMessages}
        />
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t" style={{ borderColor: colors.border }}>
        <MessageInput 
          onSendMessage={handleSendMessage} 
          onTyping={handleTyping}
          disabled={false}
        />
      </div>
    </div>
  );
};

export default ConversationView;
