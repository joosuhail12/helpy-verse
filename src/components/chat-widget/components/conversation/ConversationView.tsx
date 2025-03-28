
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
import { useConversationPersistence } from '@/hooks/chat/useConversationPersistence';

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
      
      // Mark agent messages as read when received
      if (message.sender === 'agent') {
        setTimeout(() => {
          updateMessageStatus(message.id, 'read');
        }, 1000);
      }
    },
  });
  const { queueMessage, getQueuedMessages, clearQueuedMessages } = useOfflineMessaging(conversationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { typingUsers, sendTypingIndicator } = useTypingIndicator(conversationId);

  // Use the persistence hook to load/save messages
  useConversationPersistence(conversationId, messages, {
    onLoad: (savedMessages) => {
      if (messages.length === 0) {
        setMessages(savedMessages);
      }
    }
  });

  // Function to update message status
  const updateMessageStatus = (messageId: string, status: ChatMessage['status']) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, status } : msg
    ));
  };

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
    const messageId = uuidv4();
    const newMessage: ChatMessage = {
      id: messageId,
      sender: 'user',
      content,
      timestamp: new Date(),
      conversationId,
      status: 'sending'
    };

    setMessages(prev => [...prev, newMessage]);

    if (isSubscribed) {
      try {
        await publishMessage(newMessage);
        
        // Update status to sent
        updateMessageStatus(messageId, 'sent');
        
        // Simulate server delivery after a slight delay
        setTimeout(() => {
          updateMessageStatus(messageId, 'delivered');
        }, 500);

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
          
          publishMessage(agentResponse);
          
          // Simulate agent reading the message after response
          setTimeout(() => {
            updateMessageStatus(messageId, 'read');
          }, 1000);
        }, 1500);
      } catch (error) {
        console.error('Failed to send message', error);
        updateMessageStatus(messageId, 'failed');
      }
    } else {
      await queueMessage(newMessage);
      updateMessageStatus(messageId, 'sent');
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
      
      <div className="flex-1 overflow-hidden">
        <MessageList 
          messages={messages} 
          showAvatars={true}
        />
        
        {typingUsers.length > 0 && (
          <div className="px-4">
            <TypingIndicator users={typingUsers} />
          </div>
        )}
      </div>
      
      <MessageInput 
        onSendMessage={handleSendMessage} 
        onTyping={handleTyping}
      />
    </div>
  );
};

export default ConversationView;
