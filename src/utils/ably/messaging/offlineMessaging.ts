
import { Types } from 'ably';

type MessageStatus = 'queued' | 'failed' | 'sent' | 'sending';

interface OfflineMessage {
  channelId: string;
  eventName: string;
  data: any;
  id: string;
  status: MessageStatus;
  timestamp: number;
  retryCount: number;
}

// Get offline messages from localStorage
export const getOfflineMessages = (): OfflineMessage[] => {
  try {
    const stored = localStorage.getItem('offlineMessages');
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Error retrieving offline messages:', e);
    return [];
  }
};

// Save offline messages to localStorage
export const saveOfflineMessages = (messages: OfflineMessage[]) => {
  try {
    localStorage.setItem('offlineMessages', JSON.stringify(messages));
  } catch (e) {
    console.error('Error saving offline messages:', e);
  }
};

// Add a message to the offline queue
export const addOfflineMessage = (channelId: string, eventName: string, data: any, id: string) => {
  const messages = getOfflineMessages();
  const newMessage: OfflineMessage = {
    channelId,
    eventName,
    data,
    id,
    status: 'queued' as MessageStatus,
    timestamp: Date.now(),
    retryCount: 0
  };
  
  messages.push(newMessage);
  saveOfflineMessages(messages);
  
  return newMessage;
};

// Update message status
export const updateMessageStatus = (id: string, status: MessageStatus) => {
  const messages = getOfflineMessages();
  const updatedMessages = messages.map(msg => 
    msg.id === id ? { ...msg, status } : msg
  );
  saveOfflineMessages(updatedMessages);
};

// Remove a message from the offline queue
export const removeOfflineMessage = (id: string) => {
  const messages = getOfflineMessages();
  const updatedMessages = messages.filter(msg => msg.id !== id);
  saveOfflineMessages(updatedMessages);
};

// Process offline messages when coming back online
export const processOfflineMessages = (ably?: any) => {
  if (!ably) return;
  
  const messages = getOfflineMessages();
  const queuedMessages = messages.filter(msg => msg.status === 'queued');
  
  queuedMessages.forEach(msg => {
    const channel = ably.channels.get(msg.channelId);
    
    updateMessageStatus(msg.id, 'sending' as MessageStatus);
    
    channel.publish(msg.eventName, msg.data)
      .then(() => {
        console.log(`Offline message ${msg.id} sent successfully`);
        updateMessageStatus(msg.id, 'sent' as MessageStatus);
        setTimeout(() => removeOfflineMessage(msg.id), 5000); // Remove after a delay
      })
      .catch((err: Error) => {
        console.error(`Failed to send offline message ${msg.id}:`, err);
        updateMessageStatus(msg.id, 'failed' as MessageStatus);
      });
  });
};

// Get all offline messages
export const getOfflineMessagesById = (channelId: string) => {
  const messages = getOfflineMessages();
  return messages.filter(msg => msg.channelId === channelId);
};

// Check if there are any offline messages
export const hasOfflineMessages = () => {
  return getOfflineMessages().length > 0;
};

// Update retry count for a message
export const incrementRetryCount = (id: string) => {
  const messages = getOfflineMessages();
  const updatedMessages = messages.map(msg => 
    msg.id === id ? { ...msg, retryCount: msg.retryCount + 1 } : msg
  );
  saveOfflineMessages(updatedMessages);
};

// Mark a message as sent
export const markMessageAsSent = (id: string) => {
  updateMessageStatus(id, 'sent' as MessageStatus);
  setTimeout(() => removeOfflineMessage(id), 5000); // Remove after a delay
};

// Mark a message as failed
export const markMessageAsFailed = (id: string) => {
  updateMessageStatus(id, 'failed' as MessageStatus);
};

// Queue a message for offline sending
export const queueMessage = (channelId: string, eventName: string, data: any, id: string) => {
  return addOfflineMessage(channelId, eventName, data, id);
};

// Load queued messages from storage
export const loadQueuedMessages = () => getOfflineMessages();

// Save queued messages to storage
export const saveQueuedMessages = (messages: OfflineMessage[]) => saveOfflineMessages(messages);

// Remove a message from the queue
export const removeFromQueue = (id: string) => removeOfflineMessage(id);

// Check for failed messages
export const checkForFailedMessages = () => {
  const messages = getOfflineMessages();
  return messages.some(msg => msg.status === 'failed');
};

// Resend failed messages
export const resendFailedMessages = (ably?: any) => {
  if (!ably) return;
  
  const messages = getOfflineMessages();
  const failedMessages = messages.filter(msg => msg.status === 'failed');
  
  failedMessages.forEach(msg => {
    const channel = ably.channels.get(msg.channelId);
    
    updateMessageStatus(msg.id, 'sending' as MessageStatus);
    
    channel.publish(msg.eventName, msg.data)
      .then(() => {
        console.log(`Failed message ${msg.id} resent successfully`);
        updateMessageStatus(msg.id, 'sent' as MessageStatus);
        setTimeout(() => removeOfflineMessage(msg.id), 5000);
      })
      .catch((err: Error) => {
        console.error(`Failed to resend message ${msg.id}:`, err);
        updateMessageStatus(msg.id, 'failed' as MessageStatus);
      });
  });
};

// Hooks for React components
export const useOfflineMessaging = () => {
  const offlineMessages = getOfflineMessages();
  
  return {
    offlineMessages,
    addOfflineMessage,
    markMessageAsSent,
    markMessageAsFailed,
    hasOfflineMessages: hasOfflineMessages()
  };
};
