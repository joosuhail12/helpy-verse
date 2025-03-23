
import { useEffect, useState } from 'react';
import { Types } from 'ably';
import { useChannel } from '@ably-labs/react-hooks';

export const useTypingIndicator = (channelId: string, userId: string) => {
  const [typingUsers, setTypingUsers] = useState<Record<string, { name: string; timestamp: number }>>({});
  const { channel } = useChannel(channelId);

  useEffect(() => {
    if (!channel) return;

    const handleTypingEvent = (message: Types.Message) => {
      const { data } = message;
      if (!data || !data.userId || data.userId === userId) return;

      setTypingUsers(prev => ({
        ...prev,
        [data.userId]: { 
          name: data.userName || 'Someone', 
          timestamp: Date.now() 
        }
      }));

      // Auto-remove typing indicator after 3 seconds
      setTimeout(() => {
        setTypingUsers(prev => {
          const newState = { ...prev };
          delete newState[data.userId];
          return newState;
        });
      }, 3000);
    };

    // Subscribe to typing events
    channel.subscribe('typing', handleTypingEvent);

    return () => {
      channel.unsubscribe('typing', handleTypingEvent);
    };
  }, [channel, userId]);

  const sendTypingEvent = (userName: string) => {
    if (!channel) return;
    channel.publish('typing', { userId, userName });
  };

  return {
    typingUsers: Object.values(typingUsers),
    sendTypingEvent
  };
};
