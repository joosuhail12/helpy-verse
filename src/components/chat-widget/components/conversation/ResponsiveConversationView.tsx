
import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import MessageList from './message/MessageList';
import MessageInput from './message/MessageInput';
import { useMessageSubscription } from '@/hooks/chat/useMessageSubscription';
import TypingIndicator from './TypingIndicator';

export interface Message {
  id: string;
  content: string;
  userId: string;
  timestamp: string;
}

export interface ResponsiveConversationViewProps {
  channelId: string;
  userId: string;
}

const ResponsiveConversationView: React.FC<ResponsiveConversationViewProps> = ({ channelId, userId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Message subscription hook
  const { messages, channel } = useMessageSubscription(channelId);

  useEffect(() => {
    if (!channelId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    try {
      // Do any initialization here
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
      timestamp: new Date().toISOString(),
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
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
            <MessageList messages={messages} currentUserId={userId} />
            <TypingIndicator typingUsers={[]} />
          </div>
          <div className="p-4 border-t border-gray-200">
            <MessageInput onSendMessage={sendMessage} />
          </div>
        </>
      )}
    </div>
  );
};

export default ResponsiveConversationView;
