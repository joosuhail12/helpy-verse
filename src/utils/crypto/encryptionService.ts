
import { v4 as uuidv4 } from 'uuid';

interface EncryptionKey {
  id: string;
  key: CryptoKey;
  timestamp: number;
  version: number;
}

class EncryptionService {
  private keys: Map<string, EncryptionKey> = new Map();
  private currentKeyId: string | null = null;
  private isInitialized = false;
  private pendingEncryption: Promise<void> | null = null;
  
  /**
   * Initialize the encryption service
   */
  async initialize(conversationId: string): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      // Generate a new encryption key
      await this.generateNewKey(conversationId, 1);
      this.isInitialized = true;
      console.log('Encryption service initialized');
    } catch (error) {
      console.error('Failed to initialize encryption service:', error);
      throw error;
    }
  }
  
  /**
   * Generate a new encryption key for a conversation
   */
  async generateNewKey(conversationId: string, version: number): Promise<string> {
    try {
      // Generate a random key
      const keyMaterial = await window.crypto.subtle.generateKey(
        {
          name: 'AES-GCM',
          length: 256
        },
        true,
        ['encrypt', 'decrypt']
      );
      
      const keyId = uuidv4();
      
      // Store the key
      const keyEntry: EncryptionKey = {
        id: keyId,
        key: keyMaterial,
        timestamp: Date.now(),
        version
      };
      
      this.keys.set(keyId, keyEntry);
      this.currentKeyId = keyId;
      
      console.log(`Generated new encryption key: ${keyId} (v${version})`);
      return keyId;
    } catch (error) {
      console.error('Failed to generate encryption key:', error);
      throw error;
    }
  }
  
  /**
   * Encrypt a message
   */
  async encryptMessage(message: string): Promise<{ encryptedContent: string; keyId: string }> {
    if (!this.isInitialized || !this.currentKeyId) {
      throw new Error('Encryption service not initialized');
    }
    
    try {
      const keyEntry = this.keys.get(this.currentKeyId);
      if (!keyEntry) {
        throw new Error('Current encryption key not found');
      }
      
      // Generate a random IV
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      
      // Convert message to ArrayBuffer
      const encoder = new TextEncoder();
      const data = encoder.encode(message);
      
      // Encrypt the message
      const encryptedBuffer = await window.crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv
        },
        keyEntry.key,
        data
      );
      
      // Combine IV and encrypted data for storage
      const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encryptedBuffer), iv.length);
      
      // Convert to Base64 for transmission and storage
      const base64Encrypted = btoa(String.fromCharCode(...combined));
      
      return {
        encryptedContent: base64Encrypted,
        keyId: this.currentKeyId
      };
    } catch (error) {
      console.error('Failed to encrypt message:', error);
      throw error;
    }
  }
  
  /**
   * Decrypt a message
   */
  async decryptMessage(encryptedContent: string, keyId: string): Promise<string> {
    const keyEntry = this.keys.get(keyId);
    if (!keyEntry) {
      throw new Error(`Encryption key not found: ${keyId}`);
    }
    
    try {
      // Convert from Base64
      const combined = new Uint8Array(
        atob(encryptedContent)
          .split('')
          .map(char => char.charCodeAt(0))
      );
      
      // Extract IV and encrypted data
      const iv = combined.slice(0, 12);
      const encryptedData = combined.slice(12);
      
      // Decrypt the data
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv
        },
        keyEntry.key,
        encryptedData
      );
      
      // Convert back to string
      const decoder = new TextDecoder();
      return decoder.decode(decryptedBuffer);
    } catch (error) {
      console.error(`Failed to decrypt message with key ${keyId}:`, error);
      return '[Encrypted message - unable to decrypt]';
    }
  }
  
  /**
   * Rotate encryption keys
   */
  async rotateKey(conversationId: string): Promise<string> {
    if (!this.isInitialized) {
      throw new Error('Encryption service not initialized');
    }
    
    try {
      // Get the current key version
      const currentKeyEntry = this.currentKeyId ? this.keys.get(this.currentKeyId) : null;
      const newVersion = currentKeyEntry ? currentKeyEntry.version + 1 : 1;
      
      // Generate a new key
      const newKeyId = await this.generateNewKey(conversationId, newVersion);
      console.log(`Rotated encryption key to version ${newVersion}`);
      return newKeyId;
    } catch (error) {
      console.error('Failed to rotate encryption key:', error);
      throw error;
    }
  }
  
  /**
   * Get the current key version
   */
  getCurrentKeyVersion(): number {
    if (!this.isInitialized || !this.currentKeyId) {
      return 0;
    }
    
    const currentKeyEntry = this.keys.get(this.currentKeyId);
    return currentKeyEntry ? currentKeyEntry.version : 0;
  }
  
  /**
   * Check if the service is initialized
   */
  isInitializedState(): boolean {
    return this.isInitialized;
  }
  
  /**
   * Clear all encryption keys
   */
  clearKeys(): void {
    this.keys.clear();
    this.currentKeyId = null;
    this.isInitialized = false;
    console.log('Cleared all encryption keys');
  }
}

export const encryptionService = new EncryptionService();
export default encryptionService;
