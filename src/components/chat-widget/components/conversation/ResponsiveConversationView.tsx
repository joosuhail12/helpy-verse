import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import MessageList from './message/MessageList';
import MessageInput from './message/MessageInput';
import { useMessageSubscription } from '@/hooks/chat/useMessageSubscription';
import TypingIndicator from './TypingIndicator';

interface ResponsiveConversationViewProps {
  channelId: string;
  userId: string;
}

const ResponsiveConversationView: React.FC<ResponsiveConversationViewProps> = ({ channelId, userId }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Message subscription hook
  const callback = (message) => {
    setMessages(prev => [...prev, message.data]);
  };
  
  const channel = useMessageSubscription(channelId, 'message', callback, { history: true });

  useEffect(() => {
    if (!channelId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    try {
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setIsLoading(false);
    }
  }, [channelId, channel]);

  // Send message function
  const sendMessage = (content: string) => {
    if (!channelId || !channel) {
      return Promise.reject(new Error('Cannot send message - not connected'));
    }
    
    return channel.publish('message', { 
      content, 
      userId, 
      timestamp: new Date().toISOString() 
    });
  };

  return (
    <div className="flex flex-col h-full">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-full text-red-500">
          Error: {error.message}
        </div>
      ) : (
        <>
          <div className="flex-grow overflow-y-auto p-4">
            <MessageList messages={messages} userId={userId} />
            <TypingIndicator channelId={channelId} userId={userId} />
          </div>
          <div className="p-4 border-t border-gray-200">
            <MessageInput onSubmit={sendMessage} />
          </div>
        </>
      )}
    </div>
  );
};

export default ResponsiveConversationView;
