
import React, { useState, useRef, useEffect } from 'react';
import { useRealtimeChat } from '@/hooks/chat/useRealtimeChat';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import { ChevronLeft } from 'lucide-react';

export interface ResponsiveConversationViewProps {
  workspaceId: string;
  onBack: () => void;
}

const ResponsiveConversationView: React.FC<ResponsiveConversationViewProps & { conversationId: string }> = ({
  workspaceId,
  conversationId,
  onBack
}) => {
  const { messages, sendMessage, isLoading, error } = useRealtimeChat(conversationId, workspaceId);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;
    
    setSending(true);
    try {
      await sendMessage(newMessage);
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="p-2 border-b flex items-center">
        <button 
          onClick={onBack}
          className="p-1 mr-2 rounded-full hover:bg-gray-200"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h3 className="font-medium">Conversation</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-red-500">
            Error connecting to chat. Please try again.
          </div>
        ) : (
          <>
            <MessageList messages={messages} />
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      <TypingIndicator className="px-4 h-6 text-xs text-gray-500 italic" />
      
      <div className="border-t p-4 bg-white">
        <MessageInput 
          onSendMessage={handleSendMessage}
          messageText={newMessage}
          setMessageText={setNewMessage}
          isSending={sending}
        />
      </div>
    </div>
  );
};

export default ResponsiveConversationView;
