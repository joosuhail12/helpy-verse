
import React, { useState, useEffect } from 'react';
import { useChat } from '@/hooks/chat/useChat';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { ChatMessage } from './types';

interface ConversationViewProps {
  conversationId: string;
  workspaceId: string;
}

const ConversationView: React.FC<ConversationViewProps> = ({ conversationId, workspaceId }) => {
  const { sendMessage, getMessages, loadingMessages } = useChat();
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Load messages for this conversation
  useEffect(() => {
    const fetchMessages = async () => {
      if (conversationId) {
        const conversationMessages = await getMessages(conversationId);
        if (conversationMessages && conversationMessages.length > 0) {
          setMessages(conversationMessages);
        }
      }
    };

    fetchMessages();
  }, [conversationId, getMessages]);

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;
    
    setIsSending(true);
    
    // Add user message to UI immediately
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: messageText,
      timestamp: new Date(),
      conversationId: conversationId
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    try {
      await sendMessage(conversationId, messageText);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList conversationId={conversationId} />
      </div>
      
      <MessageInput
        onSendMessage={handleSendMessage}
        isDisabled={isSending || loadingMessages}
      />
    </div>
  );
};

export default ConversationView;
