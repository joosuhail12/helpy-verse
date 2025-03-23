
import React, { useState, useRef, useEffect } from 'react';
import { useRealtimeChat } from '@/hooks/chat/useRealtimeChat';
import { useTypingIndicator } from '@/hooks/chat/useTypingIndicator';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import { Message } from './types';

interface EnhancedConversationViewProps {
  conversationId: string;
  workspaceId: string;
}

const EnhancedConversationView: React.FC<EnhancedConversationViewProps> = ({ 
  conversationId,
  workspaceId 
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    messages, 
    sendMessage, 
    isLoading, 
    error 
  } = useRealtimeChat(conversationId, workspaceId);
  
  const {
    isTyping,
    typingUser,
    startTyping,
    stopTyping
  } = useTypingIndicator(conversationId, workspaceId);

  // Handle own typing status
  useEffect(() => {
    if (newMessage && newMessage.length > 0) {
      startTyping();
    } else {
      stopTyping();
    }
  }, [newMessage, startTyping, stopTyping]);

  // Scroll to bottom whenever messages change or typing status changes
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const onSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    setSending(true);
    stopTyping();
    
    try {
      await sendMessage(newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
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
        
        {isTyping && typingUser && (
          <div className="mt-2 ml-2">
            <TypingIndicator agentName={typingUser} />
          </div>
        )}
        
        <div ref={messageEndRef} />
      </div>
      
      <div className="border-t p-3">
        <MessageInput
          onSendMessage={onSendMessage}
          onKeyDown={handleKeyDown}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={sending}
        />
      </div>
    </div>
  );
};

export default EnhancedConversationView;
