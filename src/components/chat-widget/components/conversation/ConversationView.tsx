
import React, { useState, useEffect, useRef } from 'react';
import ChatHeader from '../header/ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useMessageSubscription } from '@/hooks/chat/useMessageSubscription';
import { useOfflineMessaging } from '@/hooks/chat/useOfflineMessaging';
import { useThemeContext } from '@/context/ThemeContext';
import { ChatMessage } from './types';
import { v4 as uuidv4 } from 'uuid';
import TypingIndicator from './TypingIndicator';
import { useTypingIndicator } from '@/hooks/chat/useTypingIndicator';

interface ConversationViewProps {
  conversationId: string;
  workspaceId: string;
  onBack: () => void;
}

const ConversationView: React.FC<ConversationViewProps> = ({ conversationId, workspaceId, onBack }) => {
  const { colors } = useThemeContext();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { publishMessage, isSubscribed } = useMessageSubscription(conversationId, workspaceId, {
    onMessage: (message) => {
      setMessages(prev => [...prev, message]);
    },
  });
  const { queueMessage, getQueuedMessages, clearQueuedMessages } = useOfflineMessaging(conversationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { typingUsers, sendTypingIndicator } = useTypingIndicator(conversationId);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, typingUsers]);

  useEffect(() => {
    // Check for and send queued messages when connection is restored
    if (isSubscribed) {
      const sendQueuedMessages = async () => {
        const queuedMessages = await getQueuedMessages();
        if (queuedMessages.length > 0) {
          for (const message of queuedMessages) {
            await publishMessage(message);
          }
          await clearQueuedMessages();
        }
      };

      sendQueuedMessages();
    }
  }, [isSubscribed, getQueuedMessages, publishMessage, clearQueuedMessages]);

  const handleSendMessage = async (content: string) => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      sender: 'user',
      content,
      timestamp: new Date(),
      conversationId,
    };

    setMessages(prev => [...prev, newMessage]);

    if (isSubscribed) {
      await publishMessage(newMessage);

      // Simulate agent response for demonstration
      setTimeout(() => {
        const agentResponse: ChatMessage = {
          id: uuidv4(),
          sender: 'agent',
          content: `Thanks for your message: "${content}". How can I help further?`,
          timestamp: new Date(),
          conversationId,
          readBy: ['agent-1']
        };
        setMessages(prev => [...prev, agentResponse]);
      }, 1000);
    } else {
      await queueMessage(newMessage);
    }
  };

  const handleTyping = () => {
    sendTypingIndicator(true);
  };

  return (
    <div className="flex flex-col h-full" style={{ background: colors.background, color: colors.foreground }}>
      <ChatHeader 
        title={`Conversation ${conversationId.substring(0, 8)}`} 
        onBackClick={onBack} 
      />
      
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList 
          messages={messages} 
          showAvatars={true}
        />
        
        {typingUsers.length > 0 && (
          <TypingIndicator users={typingUsers} />
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <MessageInput 
        onSendMessage={handleSendMessage} 
        onTyping={handleTyping}
      />
    </div>
  );
};

export default ConversationView;
