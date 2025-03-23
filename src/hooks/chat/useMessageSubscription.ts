
import { useEffect, useState } from 'react';
import { Types } from 'ably';
import { useAbly } from '@ably-labs/react-hooks';

export const useMessageSubscription = (
  channelId: string,
  eventName: string,
  callback: (msg: Types.Message) => void,
  options = { history: false }
) => {
  const [channel, setChannel] = useState<any | null>(null);
  const ably = useAbly();

  useEffect(() => {
    if (!channelId || !eventName || !ably) return;
    
    // Create and subscribe to the channel
    const channelInstance = ably.channels.get(channelId);
    setChannel(channelInstance);
    
    // Subscribe to messages
    const subscription = channelInstance.subscribe(eventName, callback);
    
    // If history option is enabled, request message history
    if (options.history) {
      channelInstance.history((err, resultPage) => {
        if (err) {
          console.error('Error retrieving message history:', err);
          return;
        }
        
        resultPage?.items?.forEach(callback);
      });
    }
    
    // Cleanup function - unsubscribe when component unmounts
    return () => {
      subscription.unsubscribe();
      channelInstance.detach();
    };
  }, [channelId, eventName, callback, ably, options.history]);

  return channel;
};
