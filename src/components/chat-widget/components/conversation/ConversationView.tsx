
import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@/hooks/chat/useChat';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';

interface ConversationViewProps {
  conversationId: string;
  workspaceId: string;
}

const ConversationView: React.FC<ConversationViewProps> = ({ conversationId, workspaceId }) => {
  const { sendMessage, getMessages, loadingMessages } = useChat();
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getMessages(conversationId);
  }, [conversationId, getMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [loadingMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || isSending) return;
    
    setIsSending(true);
    try {
      await sendMessage(conversationId, messageText);
      setMessageText('');
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black">
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {loadingMessages ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            <MessageList conversationId={conversationId} />
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      <TypingIndicator className="px-4 py-1 text-sm text-gray-400 italic" />
      
      <MessageInput
        onSendMessage={handleSendMessage}
        messageText={messageText}
        setMessageText={setMessageText}
        isSending={isSending}
      />
    </div>
  );
};

export default ConversationView;
