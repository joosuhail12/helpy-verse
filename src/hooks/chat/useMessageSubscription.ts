
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
  const { channel: ablyChannel } = useChannel(channelId, (message) => {
    if (message.name === eventName) {
      callback(message);
    }
  });

  useEffect(() => {
    if (!ablyChannel) return;
    
    setChannel(ablyChannel);
    
    // If history option is enabled, request message history
    if (options.history) {
      ablyChannel.history((err, resultPage) => {
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
    
  }, [channelId, eventName, callback, ablyChannel, options.history]);

  return channel;
};
