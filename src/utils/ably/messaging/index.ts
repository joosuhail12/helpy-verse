
/**
 * Entry point for all messaging-related functionality
 */

// Re-export functionality from other files
export * from './presence';
export * from './typingIndicator';
export * from './offlineQueue';

// Export a chat message utility for monitoring presence
export const monitorEnhancedPresence = (channelName: string, clientId: string, callbacks: any) => {
  // This will be implemented in the presence.ts file and re-exported
  console.log('Monitoring enhanced presence for', channelName, clientId);
  // This is a placeholder that will be replaced by the actual implementation
  return () => {}; // Cleanup function
};
