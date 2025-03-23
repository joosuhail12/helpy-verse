
/**
 * Message management service using Ably
 */
import { getAblyChannel, getWorkspaceChannelName } from '../ably';
import { v4 as uuidv4 } from 'uuid';

export interface ChatMessageData {
  id: string;
  conversationId: string;
  content: string;
  sender: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export const sendMessage = async (
  workspaceId: string,
  conversationId: string,
  content: string,
  sender: string,
  metadata: Record<string, any> = {}
): Promise<ChatMessageData> => {
  const channelName = getWorkspaceChannelName(workspaceId, `conversations:${conversationId}`);
  
  const message: ChatMessageData = {
    id: uuidv4(),
    conversationId,
    content,
    sender,
    timestamp: new Date().toISOString(),
    metadata
  };
  
  // Publish the message
  const channel = await getAblyChannel(channelName);
  await channel.publish('message', message);
  
  return message;
};

export const getMessages = async (
  workspaceId: string,
  conversationId: string,
  limit: number = 50
): Promise<ChatMessageData[]> => {
  const channelName = getWorkspaceChannelName(workspaceId, `conversations:${conversationId}`);
  
  // Get channel
  const channel = await getAblyChannel(channelName);
  
  // Get message history
  return new Promise((resolve, reject) => {
    channel.history({ limit }, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      
      if (result && result.items) {
        const messages = result.items
          .filter(item => item.name === 'message')
          .map(item => item.data as ChatMessageData)
          .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        
        resolve(messages);
      } else {
        resolve([]);
      }
    });
  });
};
