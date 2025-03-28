
import { useState, useCallback, useEffect } from 'react';
import { useAbly } from '@/context/AblyContext';
import { ChatMessage } from '@/components/chat-widget/components/conversation/types';
import { mockChatMessages } from '@/mock/chatMessages';
import { v4 as uuidv4 } from 'uuid';

export function useChat(conversationId: string = 'default') {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const { ably, connect, isConnected } = useAbly();

  // Initialize connection to Ably
  useEffect(() => {
    if (!isConnected) {
      connect();
    }
  }, [isConnected, connect]);

  // Load initial messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        // In a real app, this would fetch messages from an API
        // For demo purposes, we'll use mock data
        const initialMessages = mockChatMessages;
        setMessages(initialMessages);
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [conversationId]);

  // Subscribe to new messages
  useEffect(() => {
    if (!ably) return;

    const channel = ably.channels.get(`chat:${conversationId}`);
    
    channel.subscribe('message', (msg) => {
      const newMessage = msg.data as ChatMessage;
      setMessages((prev) => [...prev, newMessage]);
    });

    channel.subscribe('typing', (msg) => {
      const { user, isTyping } = msg.data;
      
      if (isTyping) {
        setTypingUsers((prev) => (prev.includes(user) ? prev : [...prev, user]));
        
        // Automatically remove typing indicator after 3 seconds
        setTimeout(() => {
          setTypingUsers((prev) => prev.filter((u) => u !== user));
        }, 3000);
      } else {
        setTypingUsers((prev) => prev.filter((u) => u !== user));
      }
    });

    return () => {
      channel.unsubscribe();
    };
  }, [ably, conversationId]);

  const sendMessage = useCallback(
    async (content: string, attachments: File[] = []) => {
      if (!content.trim() && attachments.length === 0) return;

      // Create a new message
      const newMessage: ChatMessage = {
        id: uuidv4(),
        content,
        sender: 'user',
        timestamp: new Date().toISOString(),
        conversationId,
        status: 'sent',
        attachments: attachments.map((file) => ({
          id: uuidv4(),
          name: file.name,
          url: URL.createObjectURL(file),
          size: file.size,
          type: file.type,
        })),
      };

      // Add message to local state immediately
      setMessages((prev) => [...prev, newMessage]);

      // In a real app, this would send the message to an API
      // For demo purposes, we'll simulate a response
      setTimeout(() => {
        const responseMessage: ChatMessage = {
          id: uuidv4(),
          content: 'Thank you for your message. Our team will get back to you shortly.',
          sender: 'agent',
          timestamp: new Date().toISOString(),
          conversationId,
          status: 'delivered',
        };

        setMessages((prev) => [...prev, responseMessage]);
      }, 1000);

      // If Ably is connected, publish the message
      if (ably) {
        const channel = ably.channels.get(`chat:${conversationId}`);
        channel.publish('message', newMessage);
      }
    },
    [ably, conversationId]
  );

  const notifyTyping = useCallback(
    (isTyping: boolean) => {
      if (ably) {
        const channel = ably.channels.get(`chat:${conversationId}`);
        channel.publish('typing', {
          user: 'currentUser', // In a real app, use actual user info
          isTyping,
        });
      }
    },
    [ably, conversationId]
  );

  return {
    messages,
    isLoading,
    typingUsers,
    sendMessage,
    notifyTyping,
  };
}
