
import React, { useState, useEffect, useCallback } from 'react';
import { useChat } from '@/context/ChatContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import ChatHeader from '../header/ChatHeader';
import { ChatMessage, TypingUser } from './types';

interface ConversationViewProps {
  conversationId: string;
  showAvatars?: boolean;
  onSendMessage?: (content: string, attachments?: File[]) => void;
  encrypted?: boolean;
  workspaceId?: string;
  onBack?: () => void;
}

const ConversationView: React.FC<ConversationViewProps> = ({
  conversationId,
  showAvatars = true,
  onSendMessage,
  encrypted = false,
  onBack
}) => {
  const { 
    sendMessage, 
    getMessages, 
    saveMessages,
    conversations
  } = useChat();
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get the current conversation
  const currentConversation = conversations.find(c => c.id === conversationId);
  
  // Load messages on mount
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
    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      content,
      sender: 'user',
      timestamp: new Date().toISOString(),
      status: 'sent',
      conversationId
    };
    
    // Add locally for immediate feedback
    setMessages(prev => [...prev, newMessage]);
    
    // Save to local storage
    const updatedMessages = [...messages, newMessage];
    await saveMessages(conversationId, updatedMessages);
    
    if (onSendMessage) {
      onSendMessage(content, attachments);
    } else {
      await sendMessage(conversationId, content, attachments);
      
      // Simulate an agent response after a short delay
      setTimeout(() => {
        const agentResponse: ChatMessage = {
          id: crypto.randomUUID(),
          sender: 'agent',
          content: `Thank you for your message. I'll help you with that shortly!`,
          timestamp: new Date().toISOString(),
          conversationId
        };
        
        setMessages(prev => [...prev, agentResponse]);
        saveMessages(conversationId, [...updatedMessages, agentResponse]);
      }, 1000);
    }
    
    setAttachments([]);
  };

  const handleFileUpload = (files: File[]) => {
    setAttachments((prev) => [...prev, ...files]);
  };

  const handleRemoveFile = (file: File) => {
    setAttachments((prev) => prev.filter((f) => f !== file));
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
      {onBack && (
        <ChatHeader 
          title={currentConversation?.title || 'Conversation'} 
          onBackClick={onBack}
        />
      )}
      
      <div className="flex-1 overflow-hidden flex flex-col">
        <MessageList 
          messages={messages} 
          conversationId={conversationId}
          showAvatars={showAvatars}
          encrypted={encrypted}
          isLoading={isLoading}
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
          encrypted={encrypted}
          onFileUpload={handleFileUpload}
          onRemoveFile={handleRemoveFile}
          attachments={attachments}
        />
      </div>
    </div>
  );
};

export default ConversationView;
