
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
import ContactVerification from '../verification/ContactVerification';
import { useChat } from '@/context/ChatContext';
import { contactAuth } from '@/utils/auth/contactAuth';
import { sessionManager } from '@/utils/auth/sessionManager';
import { Button } from '@/components/ui/button';
import { Shield, Lock, AlertTriangle } from 'lucide-react';

interface ConversationViewProps {
  conversationId: string;
  workspaceId: string;
  onBack: () => void;
}

const ConversationView: React.FC<ConversationViewProps> = ({ conversationId, workspaceId, onBack }) => {
  const { colors } = useThemeContext();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { requiresAuthentication, isAuthenticated, endToEndEncryptionEnabled } = useChat();
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
  const [showSecurityBanner, setShowSecurityBanner] = useState(true);

  // Use the persistence hook to load/save messages
  useConversationPersistence(conversationId, messages, {
    onLoad: (savedMessages) => {
      if (messages.length === 0) {
        setMessages(savedMessages);
      }
    }
  });

  // Reset session timer on component mount and when user interacts
  useEffect(() => {
    sessionManager.initSession();
  }, []);

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
    // Reset session timer on user interaction
    sessionManager.updateActivity();
    
    const messageId = uuidv4();
    const newMessage: ChatMessage = {
      id: messageId,
      sender: 'user',
      content,
      timestamp: new Date(),
      conversationId,
      status: 'sending',
      // Add encryption flag if enabled
      encrypted: endToEndEncryptionEnabled
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
            readBy: ['agent-1'],
            encrypted: endToEndEncryptionEnabled
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
    // Reset session timer on user interaction
    sessionManager.updateActivity();
    sendTypingIndicator(true);
  };

  // If authentication is required but user is not authenticated
  if (requiresAuthentication && !isAuthenticated) {
    return (
      <div className="flex flex-col h-full" style={{ background: colors.background, color: colors.foreground }}>
        <ChatHeader 
          title="Authentication Required" 
          onBackClick={onBack} 
        />
        <ContactVerification 
          onVerified={() => {
            setIsAuthenticated(true);
          }} 
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" style={{ background: colors.background, color: colors.foreground }}>
      <ChatHeader 
        title={`Conversation ${conversationId.substring(0, 8)}`} 
        onBackClick={onBack} 
        secure={requiresAuthentication && isAuthenticated}
        encrypted={endToEndEncryptionEnabled}
      />
      
      {showSecurityBanner && (
        <div className="px-4 py-2 bg-blue-50 border-b border-blue-200 flex items-center justify-between">
          <div className="flex items-center">
            {endToEndEncryptionEnabled ? (
              <>
                <Lock className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-sm text-blue-800">End-to-end encryption enabled</span>
              </>
            ) : requiresAuthentication && isAuthenticated ? (
              <>
                <Shield className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-sm text-blue-800">Secure authenticated session</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                <span className="text-sm text-yellow-800">Standard security</span>
              </>
            )}
          </div>
          <Button 
            variant="ghost" 
            className="h-6 w-6 p-0" 
            onClick={() => setShowSecurityBanner(false)}
          >
            ×
          </Button>
        </div>
      )}
      
      <div className="flex-1 overflow-hidden">
        <MessageList 
          messages={messages} 
          showAvatars={true}
          encrypted={endToEndEncryptionEnabled}
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
        encrypted={endToEndEncryptionEnabled}
      />
    </div>
  );
};

export default ConversationView;
