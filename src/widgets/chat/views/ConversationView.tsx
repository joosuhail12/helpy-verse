
import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@/hooks/chat/useChat';
import { useThemeContext } from '@/context/ThemeContext';
import ChatHeader from '@/components/chat-widget/components/header/ChatHeader';
import MessageList from '@/components/chat-widget/components/conversation/MessageList';
import MessageInput from '@/components/chat-widget/components/conversation/MessageInput';
import { ChatMessage } from '@/components/chat-widget/components/conversation/types';
import { Loader2, Send } from 'lucide-react';
import { adaptStoreMessagesToComponentMessages, adaptComponentMessagesToStoreMessages } from '@/utils/messageTypeAdapter';
import { ThemeProvider } from '@/context/ThemeContext';

interface ConversationViewProps {
  onBack: () => void;
  onClose: () => void;
}

const ConversationView: React.FC<ConversationViewProps> = ({
  onBack,
  onClose
}) => {
  const { currentConversation, getMessages, sendMessage } = useChat();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentConversation) {
      setIsLoading(true);
      getMessages(currentConversation.id)
        .then(fetchedMessages => {
          // Convert store messages to component messages
          setMessages(adaptStoreMessagesToComponentMessages(fetchedMessages));
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching messages:', error);
          setIsLoading(false);
        });
    }
  }, [currentConversation, getMessages]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (content: string) => {
    if (!currentConversation || !content.trim()) return;

    // Optimistically add the message to the UI
    const tempMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      content,
      sender: 'user',
      timestamp: new Date(),
      conversationId: currentConversation.id
    };

    setMessages(prev => [...prev, tempMessage]);

    // Simulate typing indicator
    setIsTyping(true);

    try {
      // Send the actual message
      await sendMessage(currentConversation.id, content);
      
      // No need to add the message again as it will be included 
      // in the response from the server via the subscription
      
      // Wait a realistic amount of time for typing
      setTimeout(() => {
        setIsTyping(false);
      }, 1500);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
    }
  };

  if (!currentConversation) {
    return (
      <ThemeProvider>
        <div className="flex flex-col items-center justify-center h-full p-4">
          <p className="text-gray-500">No conversation selected</p>
          <button 
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
          >
            Back to Conversations
          </button>
        </div>
      </ThemeProvider>
    );
  }

  // Use ThemeContext within the component that needs it
  return (
    <ThemeProvider>
      <ConversationViewContent
        currentConversation={currentConversation}
        messages={messages}
        isLoading={isLoading}
        isTyping={isTyping}
        onBack={onBack}
        onClose={onClose}
        handleSendMessage={handleSendMessage}
        messagesEndRef={messagesEndRef}
      />
    </ThemeProvider>
  );
};

// Extract the content into a separate component to use useThemeContext inside it
const ConversationViewContent: React.FC<{
  currentConversation: any;
  messages: ChatMessage[];
  isLoading: boolean;
  isTyping: boolean;
  onBack: () => void;
  onClose: () => void;
  handleSendMessage: (content: string) => Promise<void>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}> = ({
  currentConversation,
  messages,
  isLoading,
  isTyping,
  onBack,
  onClose,
  handleSendMessage,
  messagesEndRef
}) => {
  const { colors, labels } = useThemeContext();
  
  return (
    <div 
      className="flex flex-col h-full" 
      style={{ 
        backgroundColor: colors.background, 
        color: colors.foreground 
      }}
    >
      <ChatHeader 
        title={currentConversation.title || "Conversation"} 
        onClose={onClose} 
        onBackClick={onBack} 
      />
      
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <MessageList 
              messages={messages} 
              showAvatars={true}
            />
            
            {isTyping && (
              <div className="flex items-center space-x-2 p-3 bg-gray-100 rounded-lg max-w-[80%] animate-pulse">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      <div className="border-t p-3" style={{ borderColor: colors.border }}>
        <MessageInput 
          onSendMessage={handleSendMessage} 
          disabled={isLoading}
          placeholder={labels?.placeholder || "Type a message..."}
        />
      </div>
    </div>
  );
};

export default ConversationView;
