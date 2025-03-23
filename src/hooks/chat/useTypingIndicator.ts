
import { useEffect, useState } from 'react';
import { useAbly } from '@ably-labs/react-hooks';
import { Types } from 'ably';

export const useTypingIndicator = (
  channelId: string,
  userId: string
) => {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const ably = useAbly();

  useEffect(() => {
    if (!channelId || !ably) return;
    
    const channel = ably.channels.get(`typing:${channelId}`);
    
    // Subscribe to typing events
    const subscription = channel.subscribe('typing', (message: Types.Message) => {
      const { clientId, data } = message;
      
      if (clientId && clientId !== userId) {
        if (data.isTyping) {
          setTypingUsers(prev => 
            prev.includes(clientId) ? prev : [...prev, clientId]
          );
        } else {
          setTypingUsers(prev => 
            prev.filter(id => id !== clientId)
          );
        }
      }
    });
    
    // Cleanup function
    return () => {
      subscription.unsubscribe();
      channel.detach();
    };
  }, [channelId, userId, ably]);

  // Function to publish typing status
  const publishTypingStatus = (isTyping: boolean) => {
    if (!channelId || !ably) return;
    
    const channel = ably.channels.get(`typing:${channelId}`);
    channel.publish('typing', { isTyping, userId });
  };

  return {
    typingUsers,
    isTyping: typingUsers.length > 0,
    publishTypingStatus
  };
};
