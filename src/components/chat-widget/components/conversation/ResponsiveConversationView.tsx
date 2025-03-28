
import React, { useState, useEffect } from 'react';
import { useRealtimeChat } from '@/hooks/chat/useRealtimeChat';
import { useMessageSubscription } from '@/hooks/chat/useMessageSubscription';
import { useTypingIndicator } from '@/hooks/chat/useTypingIndicator';
import { useConversationPersistence } from '@/hooks/chat/useConversationPersistence';
import ChatHeader from '../header/ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import { ChatMessage } from './types';
import { useChat } from '@/hooks/chat/useChat';
import { v4 as uuidv4 } from 'uuid';

export interface ResponsiveConversationViewProps {
  conversationId: string;
  workspaceId: string;
  onBack?: () => void;
}

const ResponsiveConversationView: React.FC<ResponsiveConversationViewProps> = ({
  conversationId,
  workspaceId,
  onBack
}) => {
  const { messages: realtimeMessages, sendMessage, isLoading } = useRealtimeChat(conversationId, workspaceId);
  const [typingUsers, setTypingUsers] = useState<{ clientId: string; name?: string }[]>([]);
  const { getMessages } = useChat();
  const [loadedMessages, setLoadedMessages] = useState<ChatMessage[]>([]);
  const [allMessages, setAllMessages] = useState<ChatMessage[]>([]);

  // Combine all messages from different sources
  useEffect(() => {
    if (realtimeMessages.length > 0) {
      setAllMessages(realtimeMessages);
    } else {
      setAllMessages(loadedMessages);
    }
  }, [realtimeMessages, loadedMessages]);

  // Load messages when component mounts
  useEffect(() => {
    const loadMessages = async () => {
      // First try to get from Chat hook
      const msgs = await getMessages(conversationId);
      
      if (msgs && msgs.length > 0) {
        // Assign status to messages based on readBy property
        const processedMsgs = msgs.map(msg => {
          if (msg.sender === 'user') {
            if (msg.readBy && msg.readBy.length > 0) {
              return { ...msg, status: 'read' as const };
            } else {
              return { ...msg, status: 'delivered' as const };
            }
          }
          return msg;
        });
        
        setLoadedMessages(processedMsgs);
      }
    };
    
    loadMessages();
  }, [conversationId, getMessages]);

  // Use persistence hook to load/save messages
  useConversationPersistence(conversationId, allMessages, {
    onLoad: (savedMessages) => {
      if (loadedMessages.length === 0 && realtimeMessages.length === 0) {
        setLoadedMessages(savedMessages);
      }
    }
  });

  // Initialize message subscription
  const { publishMessage } = useMessageSubscription(conversationId, workspaceId, {
    onMessage: (message: ChatMessage) => {
      // Mark agent messages as read when received by user
      if (message.sender === 'agent') {
        const updatedMsg = {
          ...message,
          readBy: message.readBy || []
        };
        
        if (!updatedMsg.readBy.includes('user')) {
          updatedMsg.readBy.push('user');
          setTimeout(() => {
            publishMessage(updatedMsg);
          }, 1000);
        }
      }
    }
  });

  // Initialize typing indicator
  const { typingUsers: activeTypers, sendTypingIndicator } = useTypingIndicator(conversationId);

  useEffect(() => {
    // Subscribe to typing status updates
    const handleTypingStatusChanged = (typingStatuses: Record<string, boolean>) => {
      setTypingUsers(
        Object.entries(typingStatuses)
          .filter(([_, isTyping]) => isTyping)
          .map(([clientId]) => ({ clientId }))
      );
    };
    
    // Set up typing indicator listener
    // This would typically be handled by the useTypingIndicator hook
    return () => {
      // Cleanup typing indicator listener
    };
  }, []);

  const handleSendMessage = async (content: string) => {
    sendTypingIndicator(false);
    
    // Create message with 'sending' status
    const messageId = uuidv4();
    const messageWithStatus: ChatMessage = {
      id: messageId,
      sender: 'user',
      content,
      timestamp: new Date(),
      conversationId,
      status: 'sending'
    };
    
    // We need to add the message to the local state first with 'sending' status
    setLoadedMessages(prev => [...prev, messageWithStatus]);
    
    try {
      await sendMessage(content);
      
      // Update status to 'sent' then 'delivered'
      setTimeout(() => {
        setLoadedMessages(prev => 
          prev.map(msg => msg.id === messageId ? { ...msg, status: 'sent' as const } : msg)
        );
        
        setTimeout(() => {
          setLoadedMessages(prev => 
            prev.map(msg => msg.id === messageId ? { ...msg, status: 'delivered' as const } : msg)
          );
          
          // Simulate read receipt after agent reply
          setTimeout(() => {
            setLoadedMessages(prev => 
              prev.map(msg => msg.id === messageId ? { ...msg, status: 'read' as const } : msg)
            );
          }, 2000);
        }, 800);
      }, 400);
    } catch (error) {
      // Update status to 'failed' if sending fails
      setLoadedMessages(prev => 
        prev.map(msg => msg.id === messageId ? { ...msg, status: 'failed' as const } : msg)
      );
    }
  };

  const handleMessageInputChange = () => {
    sendTypingIndicator(true);
  };

  return (
    <div className="flex flex-col h-full">
      <ChatHeader 
        title="Conversation" 
        onBackClick={onBack} 
        workspaceId={workspaceId}
        conversationId={conversationId}
      />
      <div className="flex-1 overflow-hidden flex flex-col">
        <MessageList 
          messages={allMessages} 
          conversationId={conversationId}
          showAvatars={true}
        />
        <div className="px-4 pb-2">
          <TypingIndicator users={activeTypers} agentName={activeTypers.length === 1 ? "Support agent" : undefined} />
          <MessageInput 
            onSendMessage={handleSendMessage}
            onTyping={handleMessageInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ResponsiveConversationView;
