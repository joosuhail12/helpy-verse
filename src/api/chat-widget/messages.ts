/**
 * Message handling for the chat widget
 */
import { v4 as uuidv4 } from 'uuid';
import { getAblyChannel } from '@/utils/ably';
import { getWidgetConfig, isWidgetInitialized } from './initialize';
import type { ChatMessage } from './types';

// In-memory message cache
let messageCache: Record<string, ChatMessage[]> = {};

/**
 * Send a message through the chat widget
 */
export const sendMessage = async (
  content: string, 
  attachments: string[] = [],
  metadata: Record<string, any> = {}
): Promise<ChatMessage | null> => {
  try {
    const config = getWidgetConfig();
    
    if (!config || !isWidgetInitialized()) {
      throw new Error('Chat widget not initialized. Call initializeChatWidget() first.');
    }
    
    const conversationId = metadata.conversationId || localStorage.getItem('currentConversationId') || uuidv4();
    
    // Save conversation ID for future use
    if (!metadata.conversationId) {
      localStorage.setItem('currentConversationId', conversationId);
    }
    
    const channelName = `workspace:${config.workspaceId}:conversations:${conversationId}`;
    const channel = await getAblyChannel(channelName);
    
    const message: ChatMessage = {
      id: uuidv4(),
      content,
      sender: 'user',
      timestamp: new Date(),
      conversationId,
      attachments: attachments.length > 0 ? attachments.map(url => ({
        id: uuidv4(),
        name: url.split('/').pop() || 'file',
        type: 'application/octet-stream',
        url,
        size: 0
      })) : undefined,
      metadata: {
        ...metadata,
        workspaceId: config.workspaceId
      }
    };
    
    // Add to local cache
    if (!messageCache[conversationId]) {
      messageCache[conversationId] = [];
    }
    messageCache[conversationId].push(message);
    
    // Publish to Ably
    await channel.publish('message', message);
    
    // Trigger event if provided
    if (config.events?.onMessageSent) {
      config.events.onMessageSent(message);
    }
    
    return message;
  } catch (error) {
    console.error('Failed to send message:', error);
    return null;
  }
};

/**
 * Get messages for the current conversation
 */
export const getMessages = async (conversationId?: string): Promise<ChatMessage[]> => {
  try {
    const config = getWidgetConfig();
    
    if (!config || !isWidgetInitialized()) {
      throw new Error('Chat widget not initialized. Call initializeChatWidget() first.');
    }
    
    // Use provided conversation ID or get from localStorage
    const activeConversationId = conversationId || 
      localStorage.getItem('currentConversationId');
    
    if (!activeConversationId) {
      return [];
    }
    
    // Return from cache if available
    if (messageCache[activeConversationId]) {
      return messageCache[activeConversationId];
    }
    
    // Otherwise fetch from Ably history
    const channelName = `workspace:${config.workspaceId}:conversations:${activeConversationId}`;
    const channel = await getAblyChannel(channelName);
    
    return new Promise((resolve) => {
      channel.history({ limit: 100 }, (err, result) => {
        if (err || !result?.items) {
          resolve([]);
          return;
        }
        
        const messages = result.items
          .filter(item => item.name === 'message')
          .map(item => item.data as ChatMessage)
          .sort((a, b) => {
            const dateA = new Date(a.timestamp).getTime();
            const dateB = new Date(b.timestamp).getTime();
            return dateA - dateB;
          });
        
        // Cache the messages
        messageCache[activeConversationId] = messages;
        
        resolve(messages);
      });
    });
  } catch (error) {
    console.error('Failed to get messages:', error);
    return [];
  }
};

/**
 * Clear the message cache (useful for testing)
 */
export const clearMessageCache = (): void => {
  messageCache = {};
};
