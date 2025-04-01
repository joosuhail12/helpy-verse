
import { ChatMessage as StoreChatMessage, FileAttachment as StoreFileAttachment } from '@/store/slices/chat/types';
import { ChatMessage as ComponentChatMessage, FileAttachment as ComponentFileAttachment } from '@/components/chat-widget/components/conversation/types';

/**
 * Adapts a message from the store format to the component format
 */
export const adaptStoreMessageToComponentMessage = (
  message: StoreChatMessage
): ComponentChatMessage => {
  // Convert reactions from Record<string, string[]> to array format
  const reactionsArray = message.reactions 
    ? Object.entries(message.reactions).map(([type, users]) => ({
        type,
        count: users.length,
        userReacted: users.includes('current-user-id') // Replace with actual user ID when available
      }))
    : undefined;

  return {
    id: message.id,
    conversationId: message.conversationId,
    content: message.content,
    sender: message.sender,
    timestamp: message.timestamp,
    status: message.status,
    readBy: message.readBy,
    // Convert attachments from StoreFileAttachment[] to ComponentFileAttachment[]
    attachments: message.attachments 
      ? message.attachments.map((attachment: StoreFileAttachment): ComponentFileAttachment => ({
          id: attachment.id,
          name: attachment.name,
          type: attachment.type,
          url: attachment.url,
          size: attachment.size,
          thumbnailUrl: attachment.thumbnailUrl,
          uploadProgress: attachment.uploadProgress
        }))
      : undefined,
    reactions: reactionsArray
  };
};

/**
 * Adapts a message from the component format to the store format
 */
export const adaptComponentMessageToStoreMessage = (
  message: ComponentChatMessage
): StoreChatMessage => {
  // Convert reactions from array to Record<string, string[]>
  const reactionsRecord: Record<string, string[]> = {};
  if (message.reactions) {
    message.reactions.forEach(reaction => {
      reactionsRecord[reaction.type] = reaction.userReacted ? ['current-user-id'] : [];
    });
  }

  return {
    id: message.id,
    conversationId: message.conversationId,
    content: message.content,
    sender: message.sender,
    // Ensure timestamp is always a string or Date for store
    timestamp: message.timestamp,
    status: message.status === 'error' ? 'delivered' : message.status,
    readBy: message.readBy,
    // Convert ComponentFileAttachment[] to StoreFileAttachment[]
    attachments: message.attachments 
      ? message.attachments.map(attachment => ({
          id: attachment.id,
          name: attachment.name,
          type: attachment.type,
          url: attachment.url,
          size: attachment.size,
          thumbnailUrl: attachment.thumbnailUrl,
          uploadProgress: attachment.uploadProgress
        }))
      : undefined,
    reactions: reactionsRecord
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
