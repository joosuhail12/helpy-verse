
import { useState, useEffect } from 'react';
import { useChat } from '@/hooks/chat/useChat';
import { ChatMessage } from '@/store/slices/chat/types';
import { v4 as uuidv4 } from 'uuid';
import { adaptComponentMessagesToStoreMessages } from '@/utils/messageTypeAdapter';

export const useRealtimeChat = (conversationId: string, workspaceId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getMessages, sendMessage: contextSendMessage } = useChat();

  useEffect(() => {
    const loadMessages = async () => {
      setIsLoading(true);
      try {
        const conversationMessages = await getMessages(conversationId);
        // Convert any string timestamps to Date objects and adapt message format
        const formattedMessages = conversationMessages.map(msg => ({
          ...msg,
          timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp),
          // Ensure attachments are in the correct format (array of strings)
          attachments: msg.attachments && Array.isArray(msg.attachments) 
            ? msg.attachments.map(att => {
                // If it's an object with url property, extract the url
                if (typeof att === 'object' && att !== null && 'url' in att) {
                  return att.url;
                }
                // If it's already a string, return it
                return att;
              })
            : undefined
        })) as ChatMessage[];
        
        setMessages(formattedMessages);
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [conversationId, getMessages]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    try {
      await contextSendMessage(conversationId, content);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return {
    messages,
    sendMessage,
    isLoading
  };
};
