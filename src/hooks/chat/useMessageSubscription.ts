
import { useEffect, useState } from 'react';
import { useChannel } from '@ably-labs/react-hooks';
import { Message } from '@/components/chat-widget/components/conversation/types';

/**
 * Hook to subscribe to messages on an Ably channel
 */
export const useMessageSubscription = (channelId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Use the Ably useChannel hook with correct parameters
  const channelData = useChannel(channelId, (message) => {
    if (message.name === 'message') {
      const newMessage = message.data as Message;
      
      setMessages(prev => {
        // Check if message already exists
        if (prev.some(m => m.id === newMessage.id)) {
          return prev;
        }
        
        // Add the new message and sort by timestamp
        return [...prev, newMessage].sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
      });
    }
  });
  
  return { messages, channel: channelData.channel };
};

export default useMessageSubscription;
