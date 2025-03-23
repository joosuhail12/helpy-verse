
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useChannel } from '@ably-labs/react-hooks';
import { 
  addOfflineMessage, 
  markMessageAsSent, 
  markMessageAsFailed,
  hasOfflineMessages,
  queueMessage
} from '@/utils/ably/messaging';

// Define types for messages
export interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
  };
  timestamp: number;
  status?: 'sending' | 'sent' | 'failed';
  isOffline?: boolean;
}

export interface QueuedMessage {
  id: string;
  content: string;
  channelId: string;
  timestamp: number;
  status: 'queued' | 'sending' | 'sent' | 'failed';
  retryCount: number;
}

export interface UserInfo {
  userId: string;
  userName: string;
}

// Create a hook for real-time chat
export const useRealtimeChat = (conversationId: string, userInfo: UserInfo) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [connectionState, setConnectionState] = useState({ connectionState: 'initializing' });
  const [queuedMessages, setQueuedMessages] = useState<QueuedMessage[]>([]);
  const [hasFailedMessages, setHasFailedMessages] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [totalMessages, setTotalMessages] = useState(0);
  
  // Use the Ably channel
  const channelData = useChannel(conversationId, (message) => {
    if (message.name === 'chat') {
      const newMessage = message.data as Message;
      
      // Don't add our own messages that are received back from Ably
      if (newMessage.sender?.id === userInfo.userId && !newMessage.isOffline) {
        return;
      }
      
      setMessages((prev) => {
        // Check if message already exists (to prevent duplicates)
        if (prev.some(m => m.id === newMessage.id)) {
          return prev;
        }
        
        return [...prev, newMessage].sort((a, b) => a.timestamp - b.timestamp);
      });
    }
  });
  
  // Update connection state
  useEffect(() => {
    if (channelData) {
      setConnectionState({ connectionState: 'attached' });
      
      return () => {
        setConnectionState({ connectionState: 'detached' });
      };
    }
  }, [channelData]);
  
  // Queue a message for offline sending
  const queueOfflineMessage = useCallback((text: string) => {
    const messageId = uuidv4();
    const timestamp = Date.now();
    
    // Create the message object
    const message: Message = {
      id: messageId,
      content: text,
      sender: {
        id: userInfo.userId,
        name: userInfo.userName || 'User'
      },
      timestamp,
      status: 'sending',
      isOffline: true
    };
    
    // Add to local messages immediately
    setMessages(prev => [...prev, message]);
    
    // Queue the message for later sending
    const queuedMessage: QueuedMessage = {
      id: messageId,
      content: text,
      channelId: conversationId,
      timestamp,
      status: 'queued',
      retryCount: 0
    };
    
    setQueuedMessages(prev => [...prev, queuedMessage]);
    
    return queuedMessage;
  }, [conversationId, userInfo.userId, userInfo.userName]);
  
  // Send a message
  const sendMessage = useCallback(async (text: string) => {
    // Create message object
    const messageId = uuidv4();
    const timestamp = Date.now();
    
    const message: Message = {
      id: messageId,
      content: text,
      sender: {
        id: userInfo.userId,
        name: userInfo.userName || 'User'
      },
      timestamp,
      status: 'sending'
    };
    
    // Add message to local state immediately
    setMessages(prev => [...prev, message]);
    setSending(true);
    
    // If offline, queue the message
    if (connectionState.connectionState !== 'attached') {
      queueOfflineMessage(text);
      setSending(false);
      return message;
    }
    
    try {
      // Send the message via Ably
      if (channelData) {
        // Simulate successful publishing
        console.log('Publishing message to Ably:', message);
      }
      
      // Update message status to sent
      setMessages(prev => 
        prev.map(m => 
          m.id === messageId ? { ...m, status: 'sent' } : m
        )
      );
      
      setSending(false);
      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Update message status to failed
      setMessages(prev => 
        prev.map(m => 
          m.id === messageId ? { ...m, status: 'failed' } : m
        )
      );
      
      // Queue for later retry
      queueOfflineMessage(text);
      
      setSending(false);
      return message;
    }
  }, [channelData, connectionState.connectionState, userInfo.userId, queueOfflineMessage, userInfo.userName]);
  
  // Handle sending a message from the UI
  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim()) return;
    
    await sendMessage(newMessage);
    setNewMessage('');
  }, [newMessage, sendMessage]);
  
  // Handle typing indicator
  const handleTyping = useCallback(() => {
    if (channelData && connectionState.connectionState === 'attached') {
      try {
        console.log('Sending typing indicator');
      } catch (error) {
        console.error('Error sending typing indicator:', error);
      }
    }
  }, [channelData, connectionState.connectionState]);
  
  // Mock function to load more messages
  const loadMoreMessages = useCallback(() => {
    setLoading(true);
    
    // Simulate loading older messages
    setTimeout(() => {
      setLoading(false);
      setHasMoreMessages(false);
    }, 1000);
  }, []);
  
  // Format timestamp helper
  const formatTimestamp = useCallback((timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  }, []);
  
  return {
    messages,
    newMessage,
    setNewMessage,
    loading,
    sending,
    typingUsers,
    connectionState,
    handleSendMessage,
    handleTyping,
    loadMoreMessages,
    hasMoreMessages,
    totalMessages,
    formatTimestamp,
    sendMessage,
    queuedMessages,
    hasFailedMessages,
    queueOfflineMessage
  };
};

export default useRealtimeChat;
