
/**
 * File attachment handling for the chat widget
 */
import { v4 as uuidv4 } from 'uuid';
import { isWidgetInitialized, getWidgetConfig } from './initialize';
import type { FileAttachment } from './types';

// In-memory attachments cache
let pendingAttachments: FileAttachment[] = [];

/**
 * Add a file attachment to the chat widget
 */
export const addAttachment = (file: File): FileAttachment | null => {
  try {
    if (!isWidgetInitialized()) {
      console.warn('Chat widget not initialized. Call initializeChatWidget() first.');
      return null;
    }
    
    // Check max file size (10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds maximum allowed (10MB): ${file.name}`);
    }
    
    // Create attachment object
    const attachment: FileAttachment = {
      id: uuidv4(),
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
      size: file.size,
      uploadProgress: 0
    };
    
    // Add thumbnail URL for images
    if (file.type.startsWith('image/')) {
      attachment.thumbnailUrl = URL.createObjectURL(file);
    }
    
    // Add to pending attachments
    pendingAttachments.push(attachment);
    
    return attachment;
  } catch (error) {
    console.error('Failed to add attachment:', error);
    return null;
  }
};

/**
 * Remove a file attachment from the chat widget
 */
export const removeAttachment = (id: string): boolean => {
  try {
    const initialLength = pendingAttachments.length;
    
    // Filter out the attachment
    pendingAttachments = pendingAttachments.filter(attachment => {
      if (attachment.id === id) {
        // Revoke object URL to prevent memory leaks
        if (attachment.url && attachment.url.startsWith('blob:')) {
          URL.revokeObjectURL(attachment.url);
        }
        if (attachment.thumbnailUrl && attachment.thumbnailUrl.startsWith('blob:')) {
          URL.revokeObjectURL(attachment.thumbnailUrl);
        }
        return false;
      }
      return true;
    });
    
    return initialLength > pendingAttachments.length;
  } catch (error) {
    console.error('Failed to remove attachment:', error);
    return false;
  }
};

/**
 * Get all pending attachments
 */
export const getAttachments = (): FileAttachment[] => {
  return [...pendingAttachments];
};

/**
 * Clear all pending attachments
 */
export const clearAttachments = (): void => {
  // Revoke all object URLs
  pendingAttachments.forEach(attachment => {
    if (attachment.url && attachment.url.startsWith('blob:')) {
      URL.revokeObjectURL(attachment.url);
    }
    if (attachment.thumbnailUrl && attachment.thumbnailUrl.startsWith('blob:')) {
      URL.revokeObjectURL(attachment.thumbnailUrl);
    }
  });
  
  pendingAttachments = [];
};

/**
 * Upload attachment to server
 * Returns the URL of the uploaded file
 */
export const uploadAttachment = async (
  attachment: FileAttachment, 
  conversationId: string
): Promise<string> => {
  try {
    const config = getWidgetConfig();
    
    if (!config || !isWidgetInitialized()) {
      throw new Error('Chat widget not initialized. Call initializeChatWidget() first.');
    }
    
    // This would normally call an API to upload the file
    // For now, we'll simulate an upload
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        
        // Update the attachment progress
        const attachmentIndex = pendingAttachments.findIndex(a => a.id === attachment.id);
        if (attachmentIndex !== -1) {
          pendingAttachments[attachmentIndex].uploadProgress = progress;
        }
        
        if (progress >= 100) {
          clearInterval(interval);
          
          // In a real implementation, we would return the URL from the server
          const uploadedUrl = `https://storage.example.com/${config.workspaceId}/${conversationId}/${attachment.name}`;
          resolve(uploadedUrl);
        }
      }, 200);
    });
  } catch (error) {
    console.error('Failed to upload attachment:', error);
    throw error;
  }
};
