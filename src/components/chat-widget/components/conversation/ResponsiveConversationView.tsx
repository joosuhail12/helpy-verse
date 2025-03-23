
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useChat } from '@/hooks/chat/useChat';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';

interface ResponsiveConversationViewProps {
  conversationId: string;
  workspaceId: string;
  onBack: () => void;
}

const ResponsiveConversationView: React.FC<ResponsiveConversationViewProps> = ({ 
  conversationId, 
  workspaceId,
  onBack
}) => {
  const { sendMessage, getMessages, loadingMessages, conversations, messages } = useChat();
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const conversation = conversations.find(c => c.id === conversationId);

  useEffect(() => {
    getMessages(conversationId);
  }, [conversationId, getMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [loadingMessages, messages]);

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
      <div className="border-b border-gray-800 p-3 flex items-center">
        <button 
          onClick={onBack}
          className="p-1 mr-2 rounded-full hover:bg-gray-800 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="font-medium truncate">
          {conversation?.title || "Conversation"}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {loadingMessages ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            <MessageList messages={messages} isLoading={loadingMessages} />
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

export default ResponsiveConversationView;
