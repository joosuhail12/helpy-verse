
// Offline messaging utilities
interface OfflineMessage {
  id: string;
  content: string;
  channelId: string;
  timestamp: number;
  status: 'queued' | 'sending' | 'sent' | 'failed';
  retryCount: number;
}

// Get all offline messages
export const getOfflineMessages = (): OfflineMessage[] => {
  try {
    const storedMessages = localStorage.getItem('offline-messages');
    return storedMessages ? JSON.parse(storedMessages) : [];
  } catch (error) {
    console.error('Error getting offline messages:', error);
    return [];
  }
};

// Save all offline messages
export const saveOfflineMessages = (messages: OfflineMessage[]): boolean => {
  try {
    localStorage.setItem('offline-messages', JSON.stringify(messages));
    return true;
  } catch (error) {
    console.error('Error saving offline messages:', error);
    return false;
  }
};

// Add a message to offline storage
export const addOfflineMessage = (message: OfflineMessage): boolean => {
  try {
    const messages = getOfflineMessages();
    messages.push(message);
    saveOfflineMessages(messages);
    return true;
  } catch (error) {
    console.error('Error adding offline message:', error);
    return false;
  }
};

// Update message status
export const updateMessageStatus = (messageId: string, status: 'sending' | 'sent' | 'failed'): boolean => {
  try {
    const messages = getOfflineMessages();
    const updatedMessages = messages.map(msg => 
      msg.id === messageId ? { ...msg, status } : msg
    );
    saveOfflineMessages(updatedMessages);
    return true;
  } catch (error) {
    console.error('Error updating message status:', error);
    return false;
  }
};

// Remove a message from offline storage
export const removeOfflineMessage = (messageId: string): boolean => {
  try {
    const messages = getOfflineMessages();
    const filteredMessages = messages.filter(msg => msg.id !== messageId);
    saveOfflineMessages(filteredMessages);
    return true;
  } catch (error) {
    console.error('Error removing offline message:', error);
    return false;
  }
};

// Process all offline messages
export const processOfflineMessages = async (): Promise<boolean> => {
  try {
    // This would normally attempt to send all queued messages
    console.log('Processing offline messages');
    return true;
  } catch (error) {
    console.error('Error processing offline messages:', error);
    return false;
  }
};

// Get offline messages for a specific channel
export const getOfflineMessagesById = (channelId: string): OfflineMessage[] => {
  try {
    const messages = getOfflineMessages();
    return messages.filter(msg => msg.channelId === channelId);
  } catch (error) {
    console.error('Error getting offline messages by ID:', error);
    return [];
  }
};

// Check if there are any offline messages
export const hasOfflineMessages = (): boolean => {
  try {
    const messages = getOfflineMessages();
    return messages.length > 0;
  } catch (error) {
    console.error('Error checking for offline messages:', error);
    return false;
  }
};

// Increment retry count for a message
export const incrementRetryCount = (messageId: string): boolean => {
  try {
    const messages = getOfflineMessages();
    const updatedMessages = messages.map(msg => 
      msg.id === messageId ? { ...msg, retryCount: msg.retryCount + 1 } : msg
    );
    saveOfflineMessages(updatedMessages);
    return true;
  } catch (error) {
    console.error('Error incrementing retry count:', error);
    return false;
  }
};

// Mark a message as sent
export const markMessageAsSent = (messageId: string): boolean => {
  return updateMessageStatus(messageId, 'sent');
};

// Mark a message as failed
export const markMessageAsFailed = (messageId: string): boolean => {
  return updateMessageStatus(messageId, 'failed');
};

// Queue a message for offline sending
export const queueMessage = (message: OfflineMessage): OfflineMessage => {
  addOfflineMessage(message);
  return message;
};

// Load queued messages
export const loadQueuedMessages = (): OfflineMessage[] => {
  return getOfflineMessages().filter(msg => msg.status === 'queued');
};

// Save queued messages
export const saveQueuedMessages = (messages: OfflineMessage[]): boolean => {
  try {
    const allMessages = getOfflineMessages();
    const nonQueuedMessages = allMessages.filter(msg => msg.status !== 'queued');
    saveOfflineMessages([...nonQueuedMessages, ...messages]);
    return true;
  } catch (error) {
    console.error('Error saving queued messages:', error);
    return false;
  }
};

// Remove a message from the queue
export const removeFromQueue = (messageId: string): boolean => {
  return removeOfflineMessage(messageId);
};

// Check for failed messages
export const checkForFailedMessages = (): boolean => {
  try {
    const messages = getOfflineMessages();
    return messages.some(msg => msg.status === 'failed');
  } catch (error) {
    console.error('Error checking for failed messages:', error);
    return false;
  }
};

// Resend failed messages
export const resendFailedMessages = async (): Promise<boolean> => {
  try {
    // This would normally attempt to resend all failed messages
    console.log('Resending failed messages');
    return true;
  } catch (error) {
    console.error('Error resending failed messages:', error);
    return false;
  }
};

// Hook-like function for offline messaging
export const useOfflineMessaging = () => {
  return {
    offlineMessages: getOfflineMessages(),
    addMessageToQueue: (message: OfflineMessage) => addOfflineMessage(message),
    processQueue: processOfflineMessages,
    hasFailedMessages: checkForFailedMessages()
  };
};
