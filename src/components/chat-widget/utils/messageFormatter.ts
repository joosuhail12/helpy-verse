
/**
 * Utility functions for formatting chat messages
 */

/**
 * Format timestamp to readable time
 */
export const formatMessageTime = (timestamp: Date | string): string => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  return date.toLocaleTimeString(undefined, { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

/**
 * Format file size to readable string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

/**
 * Sanitize message content (remove dangerous HTML, etc)
 */
export const sanitizeContent = (content: string): string => {
  // Simple sanitization example - in production you'd want a more robust solution
  return content
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};
