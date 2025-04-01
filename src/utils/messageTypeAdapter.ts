
import { ChatMessage as StoreChatMessage } from '@/store/slices/chat/types';
import { ChatMessage as ComponentChatMessage, FileAttachment } from '@/components/chat-widget/components/conversation/types';

/**
 * Adapts a message from the store format to the component format
 */
export const adaptStoreMessageToComponentMessage = (
  message: StoreChatMessage
): ComponentChatMessage => {
  return {
    ...message,
    // Convert timestamp to ensure compatibility with component type
    timestamp: message.timestamp instanceof Date ? message.timestamp : new Date(message.timestamp),
    // Convert string attachments to FileAttachment objects
    attachments: message.attachments 
      ? message.attachments.map(url => ({
          id: `attachment-${Math.random().toString(36).substr(2, 9)}`,
          url: typeof url === 'string' ? url : url.url,
          name: typeof url === 'string' ? url.split('/').pop() || 'file' : url.name,
          type: typeof url === 'string' ? getFileTypeFromUrl(url) : url.type,
          size: typeof url === 'string' ? 0 : url.size
        }))
      : undefined
  };
};

/**
 * Adapts a message from the component format to the store format
 */
export const adaptComponentMessageToStoreMessage = (
  message: ComponentChatMessage
): StoreChatMessage => {
  return {
    ...message,
    // Ensure timestamp is always a Date for store
    timestamp: typeof message.timestamp === 'string' 
      ? new Date(message.timestamp) 
      : message.timestamp,
    // Convert FileAttachment objects to string URLs
    attachments: message.attachments 
      ? message.attachments.map(attachment => attachment.url)
      : undefined
  };
};

/**
 * Adapts an array of messages from store format to component format
 */
export const adaptStoreMessagesToComponentMessages = (
  messages: StoreChatMessage[]
): ComponentChatMessage[] => {
  return messages.map(adaptStoreMessageToComponentMessage);
};

/**
 * Adapts an array of messages from component format to store format
 */
export const adaptComponentMessagesToStoreMessages = (
  messages: ComponentChatMessage[]
): StoreChatMessage[] => {
  return messages.map(adaptComponentMessageToStoreMessage);
};

/**
 * Try to guess file type from URL
 */
const getFileTypeFromUrl = (url: string): string => {
  const extension = url.split('.').pop()?.toLowerCase();
  
  switch(extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'pdf':
      return 'application/pdf';
    case 'doc':
    case 'docx':
      return 'application/msword';
    case 'xls':
    case 'xlsx':
      return 'application/excel';
    default:
      return 'application/octet-stream';
  }
};
