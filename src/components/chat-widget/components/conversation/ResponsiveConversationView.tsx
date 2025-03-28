
import React, { useState, useEffect } from 'react';
import { useChat } from '@/context/ChatContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import ChatHeader from '../header/ChatHeader';
import { TypingUser } from './types';

interface ResponsiveConversationViewProps {
  conversationId: string;
  onBack?: () => void;
}

const ResponsiveConversationView: React.FC<ResponsiveConversationViewProps> = ({
  conversationId,
  onBack
}) => {
  const { 
    sendMessage, 
    getMessages, 
    saveMessages,
    conversations
  } = useChat();
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const currentConversation = conversations.find(c => c.id === conversationId);
  
  useEffect(() => {
    const loadMessages = async () => {
      setIsLoading(true);
      try {
        const loadedMessages = await getMessages(conversationId);
        setMessages(loadedMessages);
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMessages();
  }, [conversationId, getMessages]);
  
  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Create a new message
    const newMessage = {
      id: crypto.randomUUID(),
      content,
      sender: 'user',
      timestamp: new Date().toISOString(),
      conversationId
    };
    
    // Add locally for immediate feedback
    setMessages(prev => [...prev, newMessage]);
    
    // Save to local storage
    const updatedMessages = [...messages, newMessage];
    await saveMessages(conversationId, updatedMessages);
    
    // Send to backend
    await sendMessage(conversationId, content);
    
    // Simulate an agent response after a short delay
    setTimeout(() => {
      const agentResponse = {
        id: crypto.randomUUID(),
        sender: 'agent',
        content: `Thank you for your message. I'll help you with that shortly!`,
        timestamp: new Date().toISOString(),
        conversationId
      };
      
      setMessages(prev => [...prev, agentResponse]);
      saveMessages(conversationId, [...updatedMessages, agentResponse]);
    }, 1000);
  };
  
  // Mock typing indicators for demo purposes
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].sender === 'user') {
      const timeout = setTimeout(() => {
        setTypingUsers([{
          clientId: 'agent-1',
          name: 'Agent',
          timestamp: Date.now()
        }]);
        
        setTimeout(() => {
          setTypingUsers([]);
        }, 3000);
      }, 1000);
      
      return () => clearTimeout(timeout);
    }
  }, [messages]);
  
  return (
    <div className="flex flex-col h-full">
      <ChatHeader 
        title={currentConversation?.title || 'Conversation'} 
        onBackClick={onBack}
      />
      
      <div className="flex-1 overflow-hidden">
        <MessageList 
          messages={messages} 
          conversationId={conversationId}
          isLoading={isLoading}
          // Auto-enable virtualization for large message lists
          useVirtualization={messages.length > 50}
        />
        
        {typingUsers.length > 0 && (
          <div className="px-4 py-2">
            <TypingIndicator users={typingUsers} />
          </div>
        )}
        
        <MessageInput 
          onSendMessage={handleSendMessage}
          placeholder="Type a message..."
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

export default ResponsiveConversationView;
