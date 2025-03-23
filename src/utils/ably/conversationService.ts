
/**
 * Conversation management service using Ably
 */
import { getAblyChannel, getWorkspaceChannelName } from '../ably';
import { v4 as uuidv4 } from 'uuid';

export interface ConversationMetadata {
  id: string;
  title?: string;
  createdAt: string;
  updatedAt: string;
  participants: string[];
  status: 'active' | 'closed' | 'archived';
  workspaceId: string;
}

export const createConversation = async (
  workspaceId: string,
  title?: string
): Promise<ConversationMetadata> => {
  const conversationId = uuidv4();
  const channelName = getWorkspaceChannelName(workspaceId, `conversations:${conversationId}`);
  
  const conversation: ConversationMetadata = {
    id: conversationId,
    title: title || `Conversation ${new Date().toLocaleDateString()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    participants: [],
    status: 'active',
    workspaceId
  };
  
  // Publish the conversation creation event
  const channel = await getAblyChannel(channelName);
  await channel.publish('conversation:created', conversation);
  
  return conversation;
};

export const updateConversation = async (
  workspaceId: string,
  conversationId: string,
  updates: Partial<ConversationMetadata>
): Promise<ConversationMetadata | null> => {
  const channelName = getWorkspaceChannelName(workspaceId, `conversations:${conversationId}`);
  
  // Fetch current conversation metadata (in a real app, this would come from a database)
  const channel = await getAblyChannel(channelName);
  
  // Update the conversation (simplified for demo)
  const updatedConversation: ConversationMetadata = {
    id: conversationId,
    title: updates.title || '',
    createdAt: new Date().toISOString(), // This would come from DB
    updatedAt: new Date().toISOString(),
    participants: updates.participants || [],
    status: updates.status || 'active',
    workspaceId
  };
  
  // Publish the conversation update event
  await channel.publish('conversation:updated', updatedConversation);
  
  return updatedConversation;
};

export const getConversation = async (
  workspaceId: string,
  conversationId: string
): Promise<ConversationMetadata | null> => {
  // In a real app, this would fetch from a database
  // This is a placeholder implementation
  return {
    id: conversationId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    participants: [],
    status: 'active',
    workspaceId
  };
};
