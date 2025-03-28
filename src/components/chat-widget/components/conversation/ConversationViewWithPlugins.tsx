
import React, { useState, useEffect } from 'react';
import { useChat } from '@/context/ChatContextWithPlugins';
import { useThemeContext } from '@/context/ThemeContext';
import MessageList from './MessageListWithPlugins';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import ChatHeader from '../header/ChatHeader';
import { ChatMessage, TypingUser } from './types';

interface ConversationViewProps {
  conversationId: string;
  onBack?: () => void;
}

const ConversationView: React.FC<ConversationViewProps> = ({
  conversationId,
  onBack
}) => {
  const { 
    getMessages, 
    saveMessages,
    sendMessage,
    getUiExtensions
  } = useChat();
  
  const { labels } = useThemeContext();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load messages on component mount or conversationId change
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
  
  // Handle sending a new message
  const handleSendMessage = async (content: string, attachments?: File[]) => {
    if (!content.trim() && (!attachments || attachments.length === 0)) return;
    
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      conversationId,
      content,
      sender: 'user',
      timestamp: new Date().toISOString(),
      status: 'sent',
      attachments: attachments ? attachments.map(file => ({
        id: `att_${Date.now()}_${file.name}`,
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
      })) : []
    };
    
    // Add to local state immediately
    setMessages(prev => [...prev, newMessage]);
    
    // Save messages to storage
    await saveMessages(conversationId, [...messages, newMessage]);
    
    // Send to backend
    await sendMessage(conversationId, content, attachments);
    
    // Simulate response (this would be replaced by real response in production)
    simulateResponse();
  };
  
  // Simulate a response from the chat agent
  const simulateResponse = () => {
    // Simulate typing indicator
    setTypingUsers([{ 
      clientId: 'agent', 
      name: 'Agent', 
      timestamp: Date.now() 
    }]);
    
    // Simulate a delay before response
    setTimeout(async () => {
      setTypingUsers([]);
      
      const responseMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        conversationId,
        content: "Thank you for your message. I've received it and will get back to you shortly.",
        sender: 'agent',
        timestamp: new Date().toISOString(),
        status: 'delivered',
      };
      
      // Add to local state
      setMessages(prev => [...prev, responseMessage]);
      
      // Save messages to storage
      await saveMessages(conversationId, [...messages, responseMessage]);
    }, 2000);
  };
  
  // Get UI extensions from plugins
  const headerExtensions = getUiExtensions('header', conversationId);
  const footerExtensions = getUiExtensions('footer', conversationId);
  const messageActionExtensions = getUiExtensions('messageActions', conversationId);
  
  return (
    <div className="flex flex-col h-full">
      <ChatHeader 
        title={labels.chatTitle || 'Conversation'} 
        onBackClick={onBack}
      >
        {headerExtensions}
      </ChatHeader>
      
      <div className="flex-1 overflow-hidden flex flex-col">
        <MessageList 
          messages={messages} 
          isLoading={isLoading}
          conversationId={conversationId}
          actionExtensions={messageActionExtensions}
        />
        
        {typingUsers.length > 0 && (
          <div className="px-4 py-2">
            <TypingIndicator typingUsers={typingUsers} />
          </div>
        )}
        
        <MessageInput 
          onSendMessage={handleSendMessage}
          placeholder={labels.messagePlaceholder || "Type a message..."}
          disabled={isLoading}
        />
        
        {footerExtensions && (
          <div className="mt-1 border-t border-gray-100">
            {footerExtensions}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationView;
