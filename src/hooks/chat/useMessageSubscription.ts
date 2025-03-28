
import { useEffect, useState, useCallback } from 'react';
import { useAbly } from '@/context/AblyContext';
import { ChatMessage } from '@/components/chat-widget/components/conversation/types';

interface MessageSubscriptionOptions {
  conversationId: string;
  onMessage?: (message: ChatMessage) => void;
}

export const useMessageSubscription = ({ 
  conversationId,
  onMessage 
}: MessageSubscriptionOptions) => {
  const [lastMessage, setLastMessage] = useState<ChatMessage | null>(null);
  const ably = useAbly();

  // Subscribe to messages for this conversation
  useEffect(() => {
    if (!ably.isConnected) return;
    
    const channelName = ably.getChannelName(`conversation:${conversationId}`);
    
    // Subscribe to messages
    const unsubscribe = ably.subscribe(channelName, 'message', message => {
      const chatMessage = message.data as ChatMessage;
      
      setLastMessage(chatMessage);
      
      if (onMessage) {
        onMessage(chatMessage);
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, [conversationId, ably, onMessage]);

  // Send a message
  const sendMessage = useCallback(async (content: string): Promise<void> => {
    if (!content.trim() || !ably.isConnected) return;
    
    const channelName = ably.getChannelName(`conversation:${conversationId}`);
    
    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      content,
      sender: ably.clientId,
      timestamp: new Date().toISOString(),
      conversationId,
      status: 'sending'
    };
    
    try {
      await ably.publish(channelName, 'message', message);
      
      // Update status to sent
      setLastMessage({
        ...message,
        status: 'sent'
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      
      // Update status to failed
      setLastMessage({
        ...message,
        status: 'failed'
      });
      
      throw error;
    }
  }, [conversationId, ably]);

  return {
    lastMessage,
    sendMessage
  };
};

export default useMessageSubscription;
