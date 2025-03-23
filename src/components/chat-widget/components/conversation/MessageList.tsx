
import React, { useEffect, useRef } from 'react';
import { useChat } from '@/hooks/chat/useChat';
import MessageItem from './MessageItem';
import { useThemeContext } from '@/context/ThemeContext';
import { ChatMessage } from './types';

interface MessageListProps {
  conversationId?: string;
}

const MessageList: React.FC<MessageListProps> = ({ conversationId }) => {
  const { colors } = useThemeContext();
  const { getMessages } = useChat();
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);

  // Fetch messages for this conversation
  useEffect(() => {
    const fetchMessages = async () => {
      if (conversationId) {
        const fetchedMessages = await getMessages(conversationId);
        if (fetchedMessages && fetchedMessages.length > 0) {
          setMessages(fetchedMessages);
        }
      }
    };
    
    fetchMessages();
  }, [conversationId, getMessages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="space-y-4">
      {messages.length === 0 ? (
        <div 
          className="text-center py-6 text-gray-500"
          style={{ color: `${colors.foreground}88` }}
        >
          No messages yet. Start a conversation!
        </div>
      ) : (
        messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))
      )}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default MessageList;
