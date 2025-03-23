
import { useState, useEffect, useCallback } from 'react';
import { Types } from 'ably';
import { useChannel } from '@ably-labs/react-hooks';
import { useConnectionState } from './chat/useConnectionState';
import { useOfflineMessaging } from './chat/useOfflineMessaging';

export const useRealtimeChat = (channelId: string, userId: string, initialMessages = []) => {
  const [messages, setMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [totalMessages, setTotalMessages] = useState(0);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  
  const connectionState = useConnectionState();
  const { channel } = useChannel(channelId);
  const { 
    offlineMessages, 
    addOfflineMessage, 
    markMessageAsSent, 
    markMessageAsFailed 
  } = useOfflineMessaging();

  // Load initial messages
  useEffect(() => {
    if (!channel) return;
    
    setIsLoading(true);
    
    channel.history((err, page) => {
      if (err) {
        console.error('Error fetching message history:', err);
        setError(new Error('Failed to load message history'));
        setIsLoading(false);
        return;
      }
      
      if (page && page.items) {
        const historyMessages = page.items
          .filter(msg => msg.name === 'chat')
          .map(msg => ({ 
            id: msg.id, 
            content: msg.data.content, 
            sender: msg.data.sender, 
            timestamp: msg.timestamp,
            status: 'sent'
          }))
          .reverse();
          
        setMessages(historyMessages);
        setHasMoreMessages(page.hasNext());
        setTotalMessages(historyMessages.length);
      }
      
      setIsLoading(false);
    });
  }, [channel, channelId]);

  // Subscribe to new messages
  useEffect(() => {
    if (!channel) return;
    
    const handleMessage = (message: Types.Message) => {
      if (message.name !== 'chat') return;
      
      const newMsg = {
        id: message.id,
        content: message.data.content,
        sender: message.data.sender,
        timestamp: message.timestamp,
        status: 'sent'
      };
      
      setMessages(prev => [...prev, newMsg]);
      
      // If this message was sent by the current user and was queued offline,
      // mark it as sent now
      if (message.data.sender.id === userId && message.data.offlineId) {
        markMessageAsSent(message.data.offlineId);
      }
    };
    
    channel.subscribe('chat', handleMessage);
    
    return () => {
      channel.unsubscribe('chat', handleMessage);
    };
  }, [channel, userId, markMessageAsSent]);

  // Handle sending messages
  const sendMessage = useCallback((content: string) => {
    if (!content.trim()) return null;
    
    const tempId = `temp-${Date.now()}`;
    const messageData = {
      content,
      sender: { id: userId, name: 'You' }, // Customize sender info as needed
      timestamp: Date.now(),
      offlineId: tempId
    };
    
    // Add to UI immediately with 'sending' status
    const newMsg = {
      id: tempId,
      content,
      sender: messageData.sender,
      timestamp: messageData.timestamp,
      status: 'sending'
    };
    
    setMessages(prev => [...prev, newMsg]);
    setSending(true);
    
    // If online, publish directly
    if (connectionState === 'connected' && channel) {
      channel.publish('chat', messageData)
        .then(() => {
          // Message sent successfully
          setMessages(prev => 
            prev.map(msg => 
              msg.id === tempId ? { ...msg, status: 'sent' } : msg
            )
          );
        })
        .catch(err => {
          console.error('Error sending message:', err);
          // Message failed to send
          setMessages(prev => 
            prev.map(msg => 
              msg.id === tempId ? { ...msg, status: 'failed' } : msg
            )
          );
          // Add to offline queue
          addOfflineMessage(channelId, 'chat', messageData, tempId);
        })
        .finally(() => {
          setSending(false);
        });
    } else {
      // Offline, add to queue
      addOfflineMessage(channelId, 'chat', messageData, tempId);
      setSending(false);
    }
    
    return messageData;
  }, [channelId, userId, connectionState, channel, addOfflineMessage]);

  // Load more messages from history
  const loadMoreMessages = useCallback(() => {
    if (!channel || !hasMoreMessages) return;
    
    setIsLoading(true);
    
    channel.history((err, page) => {
      if (err || !page) {
        console.error('Error loading more messages:', err);
        setIsLoading(false);
        return;
      }
      
      if (page.items) {
        const olderMessages = page.items
          .filter(msg => msg.name === 'chat')
          .map(msg => ({ 
            id: msg.id, 
            content: msg.data.content, 
            sender: msg.data.sender, 
            timestamp: msg.timestamp,
            status: 'sent'
          }))
          .reverse();
          
        setMessages(prev => [...olderMessages, ...prev]);
        setHasMoreMessages(page.hasNext());
      }
      
      setIsLoading(false);
    });
  }, [channel, hasMoreMessages]);

  // Format timestamp helper
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Handle typing
  const handleTyping = (userName: string) => {
    if (!channel) return;
    channel.publish('typing', { userId, userName });
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    newMessage,
    setNewMessage,
    loading: isLoading,
    sending,
    typingUsers: [], // This would be populated from useTypingIndicator
    connectionState,
    handleSendMessage: sendMessage,
    handleTyping,
    loadMoreMessages,
    hasMoreMessages,
    totalMessages,
    formatTimestamp
  };
};
