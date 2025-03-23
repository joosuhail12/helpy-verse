
import React, { useState, useRef, useEffect } from 'react';
import { useRealtimeChat } from '@/hooks/chat/useRealtimeChat';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';

interface ConversationViewProps {
  conversationId: string;
  workspaceId: string;
}

const ConversationView: React.FC<ConversationViewProps> = ({ conversationId, workspaceId }) => {
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

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 text-red-500">
        Error connecting to chat. Please try again.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList messages={messages} />
        <div ref={messagesEndRef} />
      </div>
      
      <TypingIndicator isTyping={false} agentName="Agent" className="px-4 h-6 text-xs text-gray-500 italic" />
      
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

export default ConversationView;
