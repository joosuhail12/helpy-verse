
import { useState, useCallback, useEffect } from 'react';
import { useAbly } from '@/context/AblyContext';
import { ChatMessage } from '@/components/chat-widget/components/conversation/types';
import { v4 as uuidv4 } from 'uuid';

// In a real app, these would be real encryption functions
const mockEncrypt = (message: string) => {
  return btoa(message);
};

const mockDecrypt = (encryptedMessage: string) => {
  try {
    return atob(encryptedMessage);
  } catch (error) {
    return 'Failed to decrypt message';
  }
};

export function useEncryptedMessages(conversationId: string, keyId: string = 'default-key') {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [encryptionKey, setEncryptionKey] = useState<string | null>(null);
  const { ably, connect, isConnected } = useAbly();

  // Initialize connection to Ably
  useEffect(() => {
    if (!isConnected) {
      connect();
    }
  }, [isConnected, connect]);

  // Simulate fetching an encryption key
  useEffect(() => {
    const getKey = async () => {
      // In a real app, you would fetch the key from a secure source
      // For demo purposes, we'll use a mock key
      setEncryptionKey('mock-encryption-key');
      setIsLoading(false);
    };

    getKey();
  }, [keyId]);

  // Subscribe to new messages
  useEffect(() => {
    if (!ably || !encryptionKey) return;

    const channel = ably.channels.get(`encrypted-chat:${conversationId}`);
    
    channel.subscribe('message', (msg) => {
      const encryptedMessage = msg.data as ChatMessage;
      
      // If the message is encrypted, decrypt it
      if (encryptedMessage.encrypted && encryptedMessage.encryptedContent) {
        const decryptedContent = mockDecrypt(encryptedMessage.encryptedContent);
        
        const decryptedMessage: ChatMessage = {
          ...encryptedMessage,
          content: decryptedContent,
        };
        
        setMessages((prev) => [...prev, decryptedMessage]);
      } else {
        // Message is not encrypted
        setMessages((prev) => [...prev, encryptedMessage]);
      }
    });

    return () => {
      channel.unsubscribe();
    };
  }, [ably, encryptionKey, conversationId]);

  const sendMessage = useCallback(
    async (content: string, shouldEncrypt: boolean = true) => {
      if (!content.trim()) return;

      if (shouldEncrypt && encryptionKey) {
        // Encrypt the message
        const encryptedContent = mockEncrypt(content);
        
        // Create a new encrypted message
        const newMessage: ChatMessage = {
          id: uuidv4(),
          content: 'Encrypted Message', // Placeholder for UI
          sender: 'user',
          timestamp: new Date().toISOString(),
          conversationId,
          encrypted: true,
          encryptedContent,
          metadata: {
            keyVersion: 1,
          },
        };

        // Add message to local state immediately
        setMessages((prev) => [...prev, {
          ...newMessage,
          content, // Show the real content in the UI
        }]);

        // If Ably is connected, publish the encrypted message
        if (ably) {
          const channel = ably.channels.get(`encrypted-chat:${conversationId}`);
          channel.publish('message', newMessage);
        }
      } else {
        // Send unencrypted message
        const newMessage: ChatMessage = {
          id: uuidv4(),
          content,
          sender: 'user',
          timestamp: new Date().toISOString(),
          conversationId,
          encrypted: false,
        };

        // Add message to local state immediately
        setMessages((prev) => [...prev, newMessage]);

        // If Ably is connected, publish the message
        if (ably) {
          const channel = ably.channels.get(`encrypted-chat:${conversationId}`);
          channel.publish('message', newMessage);
        }
      }
    },
    [ably, encryptionKey, conversationId]
  );

  return {
    messages,
    isLoading,
    sendMessage,
    isEncrypted: !!encryptionKey,
  };
}
