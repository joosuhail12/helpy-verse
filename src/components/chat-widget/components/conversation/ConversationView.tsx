
import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@/hooks/chat/useChat';
import { useThemeContext } from '@/context/ThemeContext';
import ChatHeader from '../header/ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { ChatMessage } from '@/store/slices/chat/types';
import { TypingUser } from '@/store/slices/chat/types';

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
  const { getMessages, sendMessage, loading, currentConversation } = useChat();
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize local messages
  useEffect(() => {
    if (conversationId) {
      const conversationMessages = getMessages(conversationId);
      setLocalMessages(conversationMessages);
    }
  }, [conversationId, getMessages]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [localMessages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    try {
      await sendMessage(content, conversationId);
      
      // Update local messages after sending
      const updatedMessages = getMessages(conversationId);
      setLocalMessages(updatedMessages);
      
      // Reset typing indicator
      setIsUserTyping(false);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleTyping = (isTyping: boolean) => {
    if (features?.typingIndicator) {
      setIsUserTyping(isTyping);
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
          isLoading={loading}
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
