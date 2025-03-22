
/**
 * Utility functions for accessibility improvements
 */

/**
 * Format a date for screen readers
 * @param timestamp ISO timestamp string
 * @returns Formatted date string for screen readers
 */
export const formatDateForScreenReader = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    return date.toLocaleString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  } catch (e) {
    return timestamp;
  }
};

/**
 * Format a time period for screen readers
 * @param startDate Start of time period
 * @param endDate End of time period
 * @returns Formatted time period for screen readers
 */
export const formatTimePeriodForScreenReader = (startDate: Date, endDate: Date): string => {
  try {
    const startFormatted = startDate.toLocaleString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const endFormatted = endDate.toLocaleString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    return `From ${startFormatted} to ${endFormatted}`;
  } catch (e) {
    return 'Invalid date range';
  }
};

/**
 * Get keyboard interaction instructions for a component
 * @param componentType Type of component for keyboard instructions
 * @returns String with keyboard navigation instructions
 */
export const getKeyboardInstructions = (componentType: 'conversation' | 'messageList' | 'emojiPicker'): string => {
  switch (componentType) {
    case 'conversation':
      return 'Use arrow keys to navigate between messages, Enter to select a message, and Escape to exit.';
    case 'messageList':
      return 'Use up and down arrow keys to navigate messages, Tab to access message actions.';
    case 'emojiPicker':
      return 'Use arrow keys to navigate between emojis, Enter to select an emoji, and Escape to close the picker.';
    default:
      return '';
  }
};

/**
 * Generate a unique ID for aria labeling
 * @param prefix Prefix for the ID
 * @returns Unique ID string
 */
export const generateAriaId = (prefix: string): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Create notification message for screen readers
 * @param type Type of notification
 * @param details Additional details for the notification
 * @returns String formatted for screen reader announcement
 */
export const createA11yNotification = (
  type: 'newMessage' | 'userJoined' | 'userLeft' | 'error' | 'statusChange',
  details: {[key: string]: any}
): string => {
  switch (type) {
    case 'newMessage':
      return `New message from ${details.senderName}: ${details.messageText}`;
    case 'userJoined':
      return `${details.userName} joined the conversation`;
    case 'userLeft':
      return `${details.userName} left the conversation`;
    case 'error':
      return `Error: ${details.errorMessage}`;
    case 'statusChange':
      return `Connection status changed to ${details.status}`;
    default:
      return '';
  }
};
