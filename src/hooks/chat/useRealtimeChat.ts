
import { useState, useEffect } from 'react';
import { useChat } from '@/hooks/chat/useChat';
import { ChatMessage } from '@/store/slices/chat/types';
import { v4 as uuidv4 } from 'uuid';
import { adaptComponentMessagesToStoreMessages } from '@/utils/messageTypeAdapter';

export const useRealtimeChat = (conversationId: string, workspaceId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { sendMessage: contextSendMessage } = useChat();

  useEffect(() => {
    const loadMessages = async () => {
      setIsLoading(true);
      try {
        // Use mock data or fetch from API since getMessages isn't available
        const mockMessages: ChatMessage[] = [
          {
            id: uuidv4(),
            content: 'Hello! How can I help you today?',
            sender: 'agent',
            timestamp: new Date(),
            conversationId,
          }
        ];
        
        setMessages(mockMessages);
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [conversationId]);

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
