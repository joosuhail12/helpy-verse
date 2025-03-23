
/**
 * Application constants
 */

// Message statuses
export const MESSAGE_STATUS = {
  QUEUED: 'queued',
  SENDING: 'sending',
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
  FAILED: 'failed'
};

// File upload limits
export const FILE_UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: [
    'image/*',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
};

// UI constants
export const UI = {
  MAX_TEXTAREA_HEIGHT: 150,
  TYPING_TIMEOUT: 3000
};
