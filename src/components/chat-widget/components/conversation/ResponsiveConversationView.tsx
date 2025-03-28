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

  useEffect(() => {
    if (realtimeMessages.length > 0) {
      setAllMessages(realtimeMessages);
    } else {
      setAllMessages(loadedMessages);
    }
  }, [realtimeMessages, loadedMessages]);

  useEffect(() => {
    const loadMessages = async () => {
      const msgs = await getMessages(conversationId);
      
      if (msgs && msgs.length > 0) {
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

  useConversationPersistence(conversationId, allMessages, {
    onLoad: (savedMessages) => {
      if (loadedMessages.length === 0 && realtimeMessages.length === 0) {
        setLoadedMessages(savedMessages);
      }
    }
  });

  const { publishMessage } = useMessageSubscription(conversationId, workspaceId, {
    onMessage: (message: ChatMessage) => {
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

  const { typingUsers: activeTypers, sendTypingIndicator } = useTypingIndicator(conversationId);

  useEffect(() => {
    const handleTypingStatusChanged = (typingStatuses: Record<string, boolean>) => {
      setTypingUsers(
        Object.entries(typingStatuses)
          .filter(([_, isTyping]) => isTyping)
          .map(([clientId]) => ({ clientId }))
      );
    };
    
    return () => {
    };
  }, []);

  const handleSendMessage = async (content: string) => {
    sendTypingIndicator(false);
    
    const messageId = uuidv4();
    const messageWithStatus: ChatMessage = {
      id: messageId,
      sender: 'user',
      content,
      timestamp: new Date(),
      conversationId,
      status: 'sending'
    };
    
    setLoadedMessages(prev => [...prev, messageWithStatus]);
    
    try {
      await sendMessage(content);
      
      setTimeout(() => {
        setLoadedMessages(prev => 
          prev.map(msg => msg.id === messageId ? { ...msg, status: 'sent' as const } : msg)
        );
        
        setTimeout(() => {
          setLoadedMessages(prev => 
            prev.map(msg => msg.id === messageId ? { ...msg, status: 'delivered' as const } : msg)
          );
          
          setTimeout(() => {
            setLoadedMessages(prev => 
              prev.map(msg => msg.id === messageId ? { ...msg, status: 'read' as const } : msg)
            );
          }, 2000);
        }, 800);
      }, 400);
    } catch (error) {
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
      />
      <div className="flex-1 overflow-hidden flex flex-col">
        <MessageList 
          messages={allMessages} 
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
