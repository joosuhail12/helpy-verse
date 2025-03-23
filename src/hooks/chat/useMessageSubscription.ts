
import { useEffect, useState } from 'react';
import { Types } from 'ably';
import { useChannel } from '@ably-labs/react-hooks';

export const useMessageSubscription = (
  channelId: string,
  eventName: string,
  callback: (msg: Types.Message) => void,
  options = { history: false }
) => {
  const [channel, setChannel] = useState<any | null>(null);
  const { channelInstance } = useChannel(channelId, (message) => {
    if (message.name === eventName) {
      callback(message);
    }
  });

  useEffect(() => {
    if (!channelInstance) return;
    
    setChannel(channelInstance);
    
    // If history option is enabled, request message history
    if (options.history) {
      channelInstance.history((err, resultPage) => {
        if (err) {
          console.error('Error retrieving message history:', err);
          return;
        }
        
        resultPage?.items?.forEach((message) => {
          if (message.name === eventName) {
            callback(message);
          }
        });
      });
    }
    
  }, [channelId, eventName, callback, channelInstance, options.history]);

  return channel;
};
