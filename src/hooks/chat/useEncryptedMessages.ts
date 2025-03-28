
import { useState, useCallback, useEffect } from 'react';
import { useEventSystem } from '@/hooks/useEventSystem';
import { encryptionService } from '@/utils/crypto/encryptionService';
import { ChatMessage } from '@/components/chat-widget/components/conversation/types';
import { ChatEventType } from '@/utils/events/eventTypes';
import { v4 as uuidv4 } from 'uuid';

interface UseEncryptedMessagesProps {
  conversationId: string;
  enabled: boolean;
  rotationPeriod?: number;
}

export const useEncryptedMessages = ({
  conversationId,
  enabled,
  rotationPeriod
}: UseEncryptedMessagesProps) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentKeyVersion, setCurrentKeyVersion] = useState<number>(1);
  const { publish } = useEventSystem();

  // Initialize encryption for the conversation
  useEffect(() => {
    if (!enabled || !conversationId) return;

    const initializeEncryption = async () => {
      try {
        // Check if we already have a key for this conversation
        const existingKey = await encryptionService.getConversationKey(conversationId);
        
        if (!existingKey) {
          // Set up initial encryption key if none exists
          await encryptionService.setupConversationEncryption(conversationId);
          
          // Publish event that encryption was enabled
          publish({
            type: ChatEventType.ENCRYPTION_ENABLED,
            timestamp: new Date().toISOString(),
            source: 'encryption-hook',
            conversationId
          });
        }
        
        // Set up key rotation
        await encryptionService.setupKeyRotation(conversationId, rotationPeriod);
        
        // Get the current key version
        const version = encryptionService._getCurrentKeyVersion();
        setCurrentKeyVersion(version);
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize encryption:', error);
      }
    };

    initializeEncryption();
    
    // Clean up function
    return () => {
      setIsInitialized(false);
    };
  }, [conversationId, enabled, publish, rotationPeriod]);

  // Force key rotation
  const rotateKey = useCallback(async () => {
    if (!enabled || !conversationId) return false;
    
    try {
      await encryptionService.rotateConversationKey(conversationId);
      const newVersion = encryptionService._getCurrentKeyVersion();
      setCurrentKeyVersion(newVersion);
      
      // Publish event that key was rotated
      publish({
        type: ChatEventType.KEY_ROTATED,
        timestamp: new Date().toISOString(),
        source: 'encryption-hook',
        conversationId,
        keyVersion: newVersion
      });
      
      return true;
    } catch (error) {
      console.error('Failed to rotate key:', error);
      return false;
    }
  }, [conversationId, enabled, publish]);

  // Encrypt a message
  const encryptMessage = useCallback(async (message: string): Promise<ChatMessage> => {
    const messageId = uuidv4();
    
    if (!enabled || !conversationId || !isInitialized) {
      // Return unencrypted message if encryption not enabled/initialized
      return {
        id: messageId,
        content: message,
        sender: 'user',
        timestamp: new Date().toISOString(),
        encrypted: false
      };
    }
    
    try {
      // Get the latest key
      const key = await encryptionService.getLatestConversationKey(conversationId);
      
      if (!key) {
        throw new Error('Encryption key not found');
      }
      
      // Encrypt the message
      const encryptedData = await encryptionService.encryptMessage(message, key, currentKeyVersion);
      
      // Publish event that message was encrypted
      publish({
        type: ChatEventType.MESSAGE_ENCRYPTED,
        timestamp: new Date().toISOString(),
        source: 'encryption-hook',
        conversationId,
        messageId,
        keyVersion: currentKeyVersion
      });
      
      return {
        id: messageId,
        content: message, // Keep original content for immediate display
        sender: 'user',
        timestamp: new Date().toISOString(),
        encrypted: true,
        encryptedContent: JSON.stringify(encryptedData),
        metadata: {
          keyVersion: currentKeyVersion
        }
      };
    } catch (error) {
      console.error('Failed to encrypt message:', error);
      
      // Return unencrypted message if encryption fails
      return {
        id: messageId,
        content: message,
        sender: 'user',
        timestamp: new Date().toISOString(),
        encrypted: false
      };
    }
  }, [conversationId, currentKeyVersion, enabled, isInitialized, publish]);

  // Decrypt a message
  const decryptMessage = useCallback(async (message: ChatMessage): Promise<ChatMessage> => {
    if (!message.encrypted || !message.encryptedContent || !enabled || !conversationId) {
      return message;
    }
    
    try {
      const encryptedData = JSON.parse(message.encryptedContent);
      const keyVersion = message.metadata?.keyVersion || 1;
      
      // Get the key with the specific version
      const key = await encryptionService.getConversationKeyByVersion(conversationId, keyVersion);
      
      if (!key) {
        throw new Error(`Decryption key version ${keyVersion} not found`);
      }
      
      // Decrypt the message
      const decryptedContent = await encryptionService.decryptMessage(encryptedData, key);
      
      // Publish event that message was decrypted
      publish({
        type: ChatEventType.MESSAGE_DECRYPTED,
        timestamp: new Date().toISOString(),
        source: 'encryption-hook',
        conversationId,
        messageId: message.id,
        keyVersion,
        success: true
      });
      
      return {
        ...message,
        content: decryptedContent
      };
    } catch (error) {
      console.error('Failed to decrypt message:', error);
      
      // Publish event that decryption failed
      publish({
        type: ChatEventType.MESSAGE_DECRYPTED,
        timestamp: new Date().toISOString(),
        source: 'encryption-hook',
        conversationId,
        messageId: message.id,
        keyVersion: message.metadata?.keyVersion || 1,
        success: false
      });
      
      return {
        ...message,
        content: '[Encrypted message - unable to decrypt]'
      };
    }
  }, [conversationId, enabled, publish]);

  // Decrypt multiple messages
  const decryptMessages = useCallback(async (messages: ChatMessage[]): Promise<ChatMessage[]> => {
    if (!enabled || !conversationId) {
      return messages;
    }
    
    const decryptPromises = messages.map(message => decryptMessage(message));
    return Promise.all(decryptPromises);
  }, [conversationId, decryptMessage, enabled]);

  // Re-encrypt a message with the latest key
  const reEncryptMessage = useCallback(async (message: ChatMessage): Promise<ChatMessage> => {
    if (!message.encrypted || !message.encryptedContent || !enabled || !conversationId) {
      return message;
    }
    
    try {
      const encryptedData = JSON.parse(message.encryptedContent);
      
      // Re-encrypt with the latest key
      const reEncryptedData = await encryptionService.reEncryptMessage(encryptedData, conversationId);
      
      if (!reEncryptedData) {
        throw new Error('Re-encryption failed');
      }
      
      return {
        ...message,
        encryptedContent: JSON.stringify(reEncryptedData),
        metadata: {
          ...message.metadata,
          keyVersion: currentKeyVersion
        }
      };
    } catch (error) {
      console.error('Failed to re-encrypt message:', error);
      return message;
    }
  }, [conversationId, currentKeyVersion, enabled]);

  // Re-encrypt multiple messages
  const reEncryptMessages = useCallback(async (messages: ChatMessage[]): Promise<ChatMessage[]> => {
    if (!enabled || !conversationId) {
      return messages;
    }
    
    const reEncryptPromises = messages.map(message => reEncryptMessage(message));
    return Promise.all(reEncryptPromises);
  }, [conversationId, reEncryptMessage, enabled]);

  return {
    isInitialized,
    currentKeyVersion,
    rotateKey,
    encryptMessage,
    decryptMessage,
    decryptMessages,
    reEncryptMessage,
    reEncryptMessages
  };
};
