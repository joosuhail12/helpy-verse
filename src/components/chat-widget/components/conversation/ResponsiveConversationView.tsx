
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRealtimeChat } from '@/hooks/chat/useRealtimeChat';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { Message } from './types';

interface ResponsiveConversationViewProps {
  onBack: () => void;
  workspaceId: string;
}

const ResponsiveConversationView: React.FC<ResponsiveConversationViewProps> = ({ 
  onBack,
  workspaceId
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, sendMessage, isLoading, error, channel } = useRealtimeChat("default", workspaceId);

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
      <div className="bg-gray-100 p-2 flex items-center">
        <button
          onClick={onBack}
          className="p-1 rounded-full hover:bg-gray-200 mr-2"
          aria-label="Back to conversation list"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h3 className="font-medium">Current Conversation</h3>
        </div>
      </div>

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
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={sending}
        />
      </div>
    </div>
  );
};

export default ResponsiveConversationView;
