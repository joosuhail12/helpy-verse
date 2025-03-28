
import { useState, useEffect, useCallback } from 'react';
import { encryptionService } from '@/utils/crypto/encryptionService';
import { ChatMessage } from '@/components/chat-widget/components/conversation/types';

interface UseEncryptedMessagesOptions {
  conversationId: string;
  enabled: boolean;
  rotationPeriod?: number;
}

export const useEncryptedMessages = ({
  conversationId,
  enabled,
  rotationPeriod = 24 * 60 * 60 * 1000 // 24 hours
}: UseEncryptedMessagesOptions) => {
  const [isEncrypted, setIsEncrypted] = useState<boolean>(enabled);
  const [currentKeyVersion, setCurrentKeyVersion] = useState<string | null>(null);
  
  // Initialize encryption for this conversation
  const initializeEncryption = useCallback(async (): Promise<void> => {
    if (!enabled) return;
    
    try {
      // Check if we already have a key for this conversation
      const hasKey = await encryptionService.hasConversationKey(conversationId);
      
      if (!hasKey) {
        // If not, set up new keys
        const keyVersion = await encryptionService.setupConversationEncryption(conversationId);
        setCurrentKeyVersion(keyVersion);
      } else {
        // If yes, get the current key version
        const keyVersion = await encryptionService.getCurrentKeyVersion(conversationId);
        setCurrentKeyVersion(keyVersion);
      }
      
      setIsEncrypted(true);
    } catch (error) {
      console.error('Failed to initialize encryption:', error);
      setIsEncrypted(false);
    }
  }, [conversationId, enabled]);
  
  // Rotate encryption keys periodically
  useEffect(() => {
    if (!enabled || !isEncrypted) return;
    
    const checkKeyRotation = async () => {
      try {
        const shouldRotate = await encryptionService.shouldRotateKey(conversationId, rotationPeriod);
        
        if (shouldRotate) {
          const newKeyVersion = await encryptionService.rotateEncryptionKey(conversationId);
          setCurrentKeyVersion(newKeyVersion);
        }
      } catch (error) {
        console.error('Error checking key rotation:', error);
      }
    };
    
    checkKeyRotation();
    
    const intervalId = setInterval(checkKeyRotation, rotationPeriod / 10);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [conversationId, enabled, isEncrypted, rotationPeriod]);
  
  // Encrypt a message
  const encryptMessage = useCallback(async (content: string): Promise<{
    ciphertext: string;
    iv: string;
    keyVersion: string;
  }> => {
    if (!isEncrypted) {
      throw new Error('Encryption is not enabled');
    }
    
    try {
      const key = await encryptionService.getConversationKey(conversationId);
      if (!key) {
        throw new Error('No encryption key available');
      }
      
      return await encryptionService.encryptMessage(content, key);
    } catch (error) {
      console.error('Failed to encrypt message:', error);
      throw error;
    }
  }, [conversationId, isEncrypted]);
  
  // Decrypt messages
  const decryptMessages = useCallback(async (messages: ChatMessage[]): Promise<ChatMessage[]> => {
    if (!isEncrypted) return messages;
    
    try {
      const key = await encryptionService.getConversationKey(conversationId);
      if (!key) {
        throw new Error('No encryption key available');
      }
      
      return Promise.all(
        messages.map(async (message) => {
          if (message.encrypted && message.encryptedContent) {
            try {
              const parsed = JSON.parse(message.encryptedContent);
              const decrypted = await encryptionService.decryptMessage(parsed, key);
              return { ...message, content: decrypted };
            } catch (error) {
              console.error('Failed to decrypt message:', error);
              return { ...message, content: '[Encrypted message - unable to decrypt]' };
            }
          }
          return message;
        })
      );
    } catch (error) {
      console.error('Failed to decrypt messages:', error);
      return messages.map(msg => 
        msg.encrypted ? { ...msg, content: '[Encrypted message - decryption failed]' } : msg
      );
    }
  }, [conversationId, isEncrypted]);
  
  // Rotate encryption key
  const rotateKey = useCallback(async (): Promise<string | null> => {
    if (!isEncrypted) return null;
    
    try {
      const newKeyVersion = await encryptionService.rotateEncryptionKey(conversationId);
      setCurrentKeyVersion(newKeyVersion);
      return newKeyVersion;
    } catch (error) {
      console.error('Failed to rotate encryption key:', error);
      return null;
    }
  }, [conversationId, isEncrypted]);
  
  return {
    isEncrypted,
    currentKeyVersion,
    initializeEncryption,
    encryptMessage,
    decryptMessages,
    rotateKey
  };
};

export default useEncryptedMessages;
