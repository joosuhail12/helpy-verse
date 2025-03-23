
import { useEffect, useState } from 'react';
import { Types } from 'ably';
import { useChannel } from '@ably-labs/react-hooks';

export const useTypingIndicator = (channelId: string, userId: string) => {
  const [typingUsers, setTypingUsers] = useState<Record<string, { name: string; timestamp: number }>>({});
  const { channelInstance } = useChannel(channelId);

  useEffect(() => {
    if (!channelInstance) return;

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
    channelInstance.subscribe('typing', handleTypingEvent);

    return () => {
      channelInstance.unsubscribe('typing', handleTypingEvent);
    };
  }, [channelInstance, userId]);

  const sendTypingEvent = (userName: string) => {
    if (!channelInstance) return;
    channelInstance.publish('typing', { userId, userName });
  };

  return {
    typingUsers: Object.values(typingUsers),
    sendTypingEvent
  };
};
