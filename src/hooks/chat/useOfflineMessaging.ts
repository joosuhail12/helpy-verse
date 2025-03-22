
import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { addMessage } from '@/store/slices/chat/chatSlice';
import { QueuedMessage, ChatMessage } from '@/utils/ably/types';
import { 
  loadQueuedMessages, 
  saveQueuedMessages, 
  queueMessage, 
  updateMessageStatus,
  removeFromQueue,
  hasFailedMessages,
  retryFailedMessages
} from '@/utils/ably/messaging';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface UseOfflineMessagingProps {
  isConnected: boolean;
  conversationId: string | null;
  userId: string;
}

/**
 * Hook for handling offline messaging functionality
 */
export const useOfflineMessaging = ({ 
  isConnected, 
  conversationId, 
  userId 
}: UseOfflineMessagingProps) => {
  const [queuedMessages, setQueuedMessages] = useState<QueuedMessage[]>([]);
  const [hasFailedMsgs, setHasFailedMsgs] = useState(false);
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  // Load queued messages from localStorage on mount
  useEffect(() => {
    const loadedMessages = loadQueuedMessages();
    setQueuedMessages(loadedMessages);
    setHasFailedMsgs(hasFailedMessages());
  }, []);

  // Queue a message for later sending (when offline)
  const queueOfflineMessage = (text: string): QueuedMessage | null => {
    if (!conversationId) return null;
    
    const newMessageId = uuidv4();
    const timestamp = new Date().toISOString();
    
    // Create the message object
    const newMessage: ChatMessage = {
      id: newMessageId,
      text: text,
      sender: {
        id: userId,
        name: 'You',
        type: 'customer'
      },
      timestamp: timestamp
    };
    
    // Queue the message and get back the queue-enhanced version
    const queuedMessage = queueMessage(newMessage);
    
    // Update state with the new queued message
    setQueuedMessages(prev => [...prev, queuedMessage]);
    
    // Add message to Redux store for immediate display
    if (conversationId) {
      dispatch(addMessage({
        conversationId,
        message: {
          id: newMessageId,
          text: text,
          sender: 'user',
          timestamp: timestamp,
          status: 'queued'
        }
      }));
    }
    
    return queuedMessage;
  };

  // Try to send queued messages when connection is restored
  const syncQueuedMessages = async (
    sendFunction: (
      conversationId: string, 
      text: string, 
      sender: any, 
      messageId?: string
    ) => Promise<any>
  ) => {
    if (!isConnected || queuedMessages.length === 0) return;
    
    // Show toast notification
    if (queuedMessages.length > 0) {
      toast({
        title: 'Connection restored',
        description: `Sending ${queuedMessages.length} queued message${queuedMessages.length > 1 ? 's' : ''}...`,
      });
    }
    
    // Process each queued message
    for (const message of queuedMessages) {
      try {
        // Update status to sending
        updateMessageStatus(message.id, 'sending');
        setQueuedMessages(prev => prev.map(msg => 
          msg.id === message.id ? { ...msg, status: 'sending' } : msg
        ));
        
        // Send the message
        if (message.conversationId && message.text) {
          await sendFunction(
            message.conversationId,
            message.text,
            message.sender,
            message.id
          );
          
          // Remove from queue after successful send
          removeFromQueue(message.id);
          setQueuedMessages(prev => prev.filter(msg => msg.id !== message.id));
        }
      } catch (error) {
        console.error('Failed to send queued message:', error);
        
        // Update status to failed
        updateMessageStatus(message.id, 'failed');
        setQueuedMessages(prev => prev.map(msg => 
          msg.id === message.id ? { ...msg, status: 'failed' } : msg
        ));
        
        setHasFailedMsgs(true);
      }
    }
  };

  // Try to resend failed messages
  const retryFailedMessagesHandler = async (
    sendFunction: (
      conversationId: string, 
      text: string, 
      sender: any, 
      messageId?: string
    ) => Promise<any>
  ) => {
    if (!isConnected) {
      toast({
        title: 'No connection',
        description: 'Cannot retry sending messages while offline.',
        variant: 'destructive'
      });
      return;
    }
    
    toast({
      title: 'Retrying failed messages',
      description: 'Attempting to resend failed messages...',
    });
    
    try {
      // Create a wrapper function that adapts the signature
      const wrappedSendFunction = async (message: ChatMessage): Promise<void> => {
        if (message.conversationId && message.text && message.sender) {
          await sendFunction(
            message.conversationId,
            message.text,
            message.sender,
            message.id
          );
        }
      };
      
      const result = await retryFailedMessages(wrappedSendFunction);
      
      // Update the UI with the result
      const remainingMessages = queuedMessages.filter(msg => {
        return !result.success.includes(msg.id);
      });
      
      setQueuedMessages(remainingMessages);
      setHasFailedMsgs(remainingMessages.some(msg => msg.status === 'failed'));
      
      if (remainingMessages.some(msg => msg.status === 'failed')) {
        toast({
          title: 'Some messages failed',
          description: 'Some messages could not be sent. Please try again later.',
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Success',
          description: 'All messages sent successfully.',
        });
      }
    } catch (error) {
      console.error('Error retrying failed messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to retry sending messages.',
        variant: 'destructive'
      });
    }
  };

  return {
    queuedMessages,
    hasFailedMessages: hasFailedMsgs,
    queueOfflineMessage,
    syncQueuedMessages,
    retryFailedMessages: retryFailedMessagesHandler
  };
};

// This named export is needed for compatibility with the existing code
export default useOfflineMessaging;
