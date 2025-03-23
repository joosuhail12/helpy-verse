
// Types for offline messaging
interface OfflineMessage {
  id: string;
  channelId: string;
  content: string;
  sender: {
    id: string;
    name: string;
  };
  timestamp: number;
  status: 'sending' | 'sent' | 'failed';
  retryCount: number;
}

// Storage key for offline messages
const OFFLINE_MESSAGES_KEY = 'ably-offline-messages';
const QUEUED_MESSAGES_KEY = 'ably-queued-messages';

// Get offline messages from local storage
export const getOfflineMessages = (): OfflineMessage[] => {
  try {
    const stored = localStorage.getItem(OFFLINE_MESSAGES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error getting offline messages', error);
    return [];
  }
};

// Save offline messages to local storage
export const saveOfflineMessages = (messages: OfflineMessage[]): void => {
  try {
    localStorage.setItem(OFFLINE_MESSAGES_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('Error saving offline messages', error);
  }
};

// Add a new offline message
export const addOfflineMessage = (message: OfflineMessage): void => {
  const messages = getOfflineMessages();
  messages.push(message);
  saveOfflineMessages(messages);
};

// Update message status
export const updateMessageStatus = (
  messageId: string,
  status: 'sending' | 'sent' | 'failed'
): void => {
  const messages = getOfflineMessages();
  const updatedMessages = messages.map((message) =>
    message.id === messageId ? { ...message, status } : message
  );
  saveOfflineMessages(updatedMessages);
};

// Remove an offline message
export const removeOfflineMessage = (messageId: string): void => {
  const messages = getOfflineMessages();
  const updatedMessages = messages.filter((message) => message.id !== messageId);
  saveOfflineMessages(updatedMessages);
};

// Process offline messages
export const processOfflineMessages = async (
  sendMessageFn: (channelId: string, content: string, sender: any) => Promise<any>
): Promise<void> => {
  const messages = getOfflineMessages();
  
  for (const message of messages) {
    if (message.status !== 'sent') {
      try {
        await sendMessageFn(message.channelId, message.content, message.sender);
        updateMessageStatus(message.id, 'sent');
      } catch (error) {
        console.error('Error processing offline message', error);
        updateMessageStatus(message.id, 'failed');
      }
    }
  }
};

// Get offline messages for a specific channel
export const getOfflineMessagesById = (channelId: string): OfflineMessage[] => {
  const messages = getOfflineMessages();
  return messages.filter((message) => message.channelId === channelId);
};

// Check if there are any offline messages
export const hasOfflineMessages = (): boolean => {
  return getOfflineMessages().length > 0;
};

// Increment retry count for a message
export const incrementRetryCount = (messageId: string): void => {
  const messages = getOfflineMessages();
  const updatedMessages = messages.map((message) =>
    message.id === messageId
      ? { ...message, retryCount: (message.retryCount || 0) + 1 }
      : message
  );
  saveOfflineMessages(updatedMessages);
};

// Mark message as sent
export const markMessageAsSent = (messageId: string): void => {
  updateMessageStatus(messageId, 'sent');
};

// Mark message as failed
export const markMessageAsFailed = (messageId: string): void => {
  updateMessageStatus(messageId, 'failed');
};

// Queue a message for sending
export const queueMessage = (message: Omit<OfflineMessage, 'status' | 'retryCount'>): OfflineMessage => {
  const newMessage: OfflineMessage = {
    ...message,
    status: 'sending',
    retryCount: 0
  };
  
  addOfflineMessage(newMessage);
  return newMessage;
};

// Load queued messages
export const loadQueuedMessages = (): OfflineMessage[] => {
  try {
    const stored = localStorage.getItem(QUEUED_MESSAGES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading queued messages', error);
    return [];
  }
};

// Save queued messages
export const saveQueuedMessages = (messages: OfflineMessage[]): void => {
  try {
    localStorage.setItem(QUEUED_MESSAGES_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('Error saving queued messages', error);
  }
};

// Remove message from queue
export const removeFromQueue = (messageId: string): void => {
  const messages = loadQueuedMessages();
  const updatedMessages = messages.filter((message) => message.id !== messageId);
  saveQueuedMessages(updatedMessages);
};

// Check for failed messages
export const checkForFailedMessages = (): OfflineMessage[] => {
  const messages = getOfflineMessages();
  return messages.filter((message) => message.status === 'failed');
};

// Resend failed messages
export const resendFailedMessages = async (
  sendMessageFn: (channelId: string, content: string, sender: any) => Promise<any>
): Promise<void> => {
  const failedMessages = checkForFailedMessages();
  
  for (const message of failedMessages) {
    try {
      updateMessageStatus(message.id, 'sending');
      await sendMessageFn(message.channelId, message.content, message.sender);
      updateMessageStatus(message.id, 'sent');
    } catch (error) {
      console.error('Error resending failed message', error);
      updateMessageStatus(message.id, 'failed');
    }
  }
};

// Custom hook for offline messaging
export const useOfflineMessaging = () => {
  const messages = getOfflineMessages();
  const hasFailedMessages = messages.some((message) => message.status === 'failed');
  
  return {
    offlineMessages: messages,
    hasFailedMessages,
    queueMessage,
    markMessageAsSent,
    markMessageAsFailed,
    resendFailedMessages
  };
};
