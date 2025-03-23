
import React, { useState, useRef, useEffect } from 'react';
import { useRealtimeChat } from '@/hooks/chat/useRealtimeChat';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { Message } from './types';

interface ConversationViewProps {
  conversationId: string;
  workspaceId: string;
}

const ConversationView: React.FC<ConversationViewProps> = ({ 
  conversationId,
  workspaceId 
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, sendMessage, isLoading, error } = useRealtimeChat(conversationId, workspaceId);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    setSending(true);
    
    try {
      await sendMessage(newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList 
          messages={messages as Message[]} 
          isLoading={isLoading} 
          error={error}
        />
        <div ref={messageEndRef} />
      </div>
      
      <div className="border-t p-3">
        <MessageInput
          onSendMessage={onSendMessage}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sending={sending}
        />
      </div>
    </div>
  );
};

export default ConversationView;
