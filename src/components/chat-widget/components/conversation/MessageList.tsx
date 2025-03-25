
import React, { useEffect, useRef } from 'react';
import { useChat } from '@/hooks/chat/useChat';
import MessageItem from './MessageItem';
import { useThemeContext } from '@/context/ThemeContext';
import { ChatMessage } from './types';

interface MessageListProps {
  conversationId?: string;
  messages?: ChatMessage[];
  isLoading?: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ conversationId, messages: propMessages, isLoading = false }) => {
  const { colors, labels } = useThemeContext();
  const { getMessages } = useChat();
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = React.useState<ChatMessage[]>(propMessages || []);

  // Fetch messages for this conversation if propMessages is not provided
  useEffect(() => {
    if (propMessages) {
      setMessages(propMessages);
      return;
    }

    const fetchMessages = async () => {
      if (conversationId) {
        const fetchedMessages = await getMessages(conversationId);
        if (fetchedMessages && fetchedMessages.length > 0) {
          setMessages(fetchedMessages);
        }
      }
    };
    
    if (conversationId) {
      fetchMessages();
    }
  }, [conversationId, getMessages, propMessages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div 
            className="text-center py-6 text-gray-500"
            style={{ color: `${colors.foreground}88` }}
          >
            {labels.noMessagesText || "No messages yet. Start a conversation!"}
          </div>
        ) : (
          messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))
        )}
        <div ref={endOfMessagesRef} />
      </div>
    </div>
  );
};

export default MessageList;
