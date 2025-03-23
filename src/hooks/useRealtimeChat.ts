
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useChannel } from '@ably-labs/react-hooks';
import { 
  addOfflineMessage, 
  markMessageAsSent, 
  markMessageAsFailed,
  hasOfflineMessages
} from '@/utils/ably/messaging/offlineMessaging';

// Define types for messages
interface Message {
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

interface QueuedMessage {
  id: string;
  content: string;
  channelId: string;
  timestamp: number;
  status: 'queued' | 'sending' | 'sent' | 'failed';
  retryCount: number;
}

// Create a hook for real-time chat
export const useRealtimeChat = (conversationId: string, currentUserId: string, userName: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [connectionState, setConnectionState] = useState({ connectionState: 'initializing' });
  const [queuedMessages, setQueuedMessages] = useState<QueuedMessage[]>([]);
  const [hasFailedMessages, setHasFailedMessages] = useState(false);
  
  // Use the Ably channel
  const { channelInstance, status } = useChannel(conversationId, (message) => {
    if (message.name === 'chat') {
      const newMessage = message.data;
      
      // Don't add our own messages that are received back from Ably
      if (newMessage.sender?.id === currentUserId && !newMessage.isOffline) {
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
    setConnectionState({ connectionState: status });
  }, [status]);
  
  // Queue a message for offline sending
  const queueOfflineMessage = useCallback((text: string) => {
    const messageId = uuidv4();
    const timestamp = Date.now();
    
    // Create the message object
    const message: Message = {
      id: messageId,
      content: text,
      sender: {
        id: currentUserId,
        name: userName || 'User'
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
  }, [conversationId, currentUserId, userName]);
  
  // Send a message
  const sendMessage = useCallback(async (text: string) => {
    // Create message object
    const messageId = uuidv4();
    const timestamp = Date.now();
    
    const message = {
      id: messageId,
      content: text,
      sender: {
        id: currentUserId,
        name: userName || 'User'
      },
      timestamp,
      status: 'sending'
    };
    
    // Add message to local state immediately
    setMessages(prev => [...prev, message]);
    
    // If offline, queue the message
    if (connectionState.connectionState !== 'connected') {
      queueOfflineMessage(text);
      return message;
    }
    
    try {
      // Send the message via Ably
      await channelInstance?.publish('chat', message);
      
      // Update message status to sent
      setMessages(prev => 
        prev.map(m => 
          m.id === messageId ? { ...m, status: 'sent' } : m
        )
      );
      
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
      
      return message;
    }
  }, [channelInstance, connectionState.connectionState, currentUserId, queueOfflineMessage, userName]);
  
  // Sync queued messages when connection is restored
  const syncQueuedMessages = useCallback(async (sendFunction) => {
    if (connectionState.connectionState !== 'connected') return;
    
    const promises = queuedMessages.map(async (msg) => {
      try {
        await sendFunction(conversationId, msg.content, {
          id: currentUserId,
          name: userName
        }, msg.id);
        
        // Update message status
        setMessages(prev => 
          prev.map(m => 
            m.id === msg.id ? { ...m, status: 'sent', isOffline: false } : m
          )
        );
        
        return { id: msg.id, success: true };
      } catch (err) {
        console.error('Failed to sync message:', msg.id, err);
        return { id: msg.id, success: false };
      }
    });
    
    const results = await Promise.all(promises);
    
    // Remove successful messages from queue
    const successfulIds = results
      .filter(r => r.success)
      .map(r => r.id);
    
    setQueuedMessages(prev => 
      prev.filter(msg => !successfulIds.includes(msg.id))
    );
    
    // Update failed messages flag
    setHasFailedMessages(queuedMessages.some(msg => msg.status === 'failed'));
    
    return results;
  }, [connectionState.connectionState, conversationId, currentUserId, queuedMessages, userName]);
  
  // Retry failed messages
  const retryFailedMessages = useCallback(async (sendFunction) => {
    const failedMessages = queuedMessages.filter(msg => msg.status === 'failed');
    
    if (failedMessages.length === 0) return [];
    
    // Mark messages as sending
    setQueuedMessages(prev => 
      prev.map(msg => 
        msg.status === 'failed' ? { ...msg, status: 'sending' } : msg
      )
    );
    
    // Update UI
    setMessages(prev => 
      prev.map(m => 
        failedMessages.some(fm => fm.id === m.id) 
          ? { ...m, status: 'sending' } 
          : m
      )
    );
    
    return syncQueuedMessages(sendFunction);
  }, [queuedMessages, syncQueuedMessages]);
  
  return {
    messages,
    connectionState,
    sendMessage,
    queuedMessages,
    hasFailedMessages,
    queueOfflineMessage,
    syncQueuedMessages,
    retryFailedMessages
  };
};

export default useRealtimeChat;
