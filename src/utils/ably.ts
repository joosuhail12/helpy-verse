
/**
 * Utility functions for working with Ably real-time messaging
 */
import * as Ably from 'ably';
import { v4 as uuidv4 } from 'uuid';

// To avoid re-export conflicts, explicitly export from conversationService and other services
export * from './ably/conversationService';
export * from './ably/messageService';

// Re-export presence service with namespace to avoid conflicts
import * as presenceService from './ably/presenceService';
export { presenceService };

// Re-export messaging utilities with namespace to avoid conflicts
import * as messaging from './ably/messaging/index';
export { messaging };

// Ably API key - this is a client key which is safe to expose
const ABLY_API_KEY = "X4jpaA.kKXoZg:oEr5R_kjKk06Wk0iilgK_rGAE9hbFjQMU8wYoE_BnEc";

let ablyClient: Ably.Realtime | null = null;
let clientId: string;

// Get or create client ID
const getClientId = (): string => {
  if (clientId) return clientId;
  
  const savedClientId = localStorage.getItem('ably_client_id');
  if (savedClientId) {
    clientId = savedClientId;
    return clientId;
  }
  
  clientId = uuidv4();
  localStorage.setItem('ably_client_id', clientId);
  return clientId;
};

// Initialize Ably client
export const initializeAbly = (): Ably.Realtime => {
  if (ablyClient) return ablyClient;
  
  ablyClient = new Ably.Realtime({
    key: ABLY_API_KEY,
    clientId: getClientId(),
  });
  
  return ablyClient;
};

// Get Ably channel
export const getAblyChannel = async (channelName: string) => {
  const client = initializeAbly();
  return client.channels.get(channelName);
};

// Clean up Ably resources
export const cleanupAblyChannels = () => {
  if (!ablyClient) return;
  
  ablyClient.close();
  ablyClient = null;
};

// Get full channel name with workspace
export const getWorkspaceChannelName = (workspaceId: string, channelName: string): string => {
  return `workspace:${workspaceId}:${channelName}`;
};
