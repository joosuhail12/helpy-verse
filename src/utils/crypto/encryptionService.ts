
/**
 * Encryption Service
 * Provides end-to-end encryption for chat messages
 * Uses Web Crypto API for secure cryptographic operations
 */

// Base encryption key size in bytes (256-bit)
const KEY_SIZE = 32;
// IV size in bytes
const IV_SIZE = 12;

interface EncryptedData {
  iv: string;      // Base64 encoded initialization vector
  data: string;    // Base64 encoded encrypted data
  signature?: string; // Base64 encoded signature
}

export const encryptionService = {
  // Generate an encryption key pair for a conversation
  async generateEncryptionKey(): Promise<CryptoKey> {
    try {
      return await window.crypto.subtle.generateKey(
        {
          name: 'AES-GCM',
          length: 256,
        },
        true, // extractable
        ['encrypt', 'decrypt']
      );
    } catch (error) {
      console.error('Failed to generate encryption key:', error);
      throw new Error('Encryption key generation failed');
    }
  },
  
  // Export key as string for storage
  async exportKey(key: CryptoKey): Promise<string> {
    try {
      const rawKey = await window.crypto.subtle.exportKey('raw', key);
      return this._arrayBufferToBase64(rawKey);
    } catch (error) {
      console.error('Failed to export key:', error);
      throw new Error('Key export failed');
    }
  },
  
  // Import key from string
  async importKey(keyStr: string): Promise<CryptoKey> {
    try {
      const rawKey = this._base64ToArrayBuffer(keyStr);
      return await window.crypto.subtle.importKey(
        'raw',
        rawKey,
        { name: 'AES-GCM' },
        false, // not extractable by default
        ['encrypt', 'decrypt']
      );
    } catch (error) {
      console.error('Failed to import key:', error);
      throw new Error('Key import failed');
    }
  },
  
  // Encrypt message
  async encryptMessage(message: string, key: CryptoKey): Promise<EncryptedData> {
    try {
      // Generate a random initialization vector
      const iv = window.crypto.getRandomValues(new Uint8Array(IV_SIZE));
      
      // Encode the message as UTF-8
      const encodedMessage = new TextEncoder().encode(message);
      
      // Encrypt the message
      const encryptedData = await window.crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv,
        },
        key,
        encodedMessage
      );
      
      // Return the encrypted data and IV as base64 strings
      return {
        iv: this._arrayBufferToBase64(iv),
        data: this._arrayBufferToBase64(encryptedData)
      };
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Message encryption failed');
    }
  },
  
  // Decrypt message
  async decryptMessage(encryptedData: EncryptedData, key: CryptoKey): Promise<string> {
    try {
      // Decode the base64 strings to array buffers
      const iv = this._base64ToArrayBuffer(encryptedData.iv);
      const data = this._base64ToArrayBuffer(encryptedData.data);
      
      // Decrypt the data
      const decryptedData = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv,
        },
        key,
        data
      );
      
      // Decode the result as UTF-8
      return new TextDecoder().decode(decryptedData);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Message decryption failed');
    }
  },
  
  // Generate a random conversation key and store it securely
  async setupConversationEncryption(conversationId: string): Promise<string> {
    try {
      // Generate a new encryption key
      const key = await this.generateEncryptionKey();
      
      // Export the key to a string
      const keyString = await this.exportKey(key);
      
      // Store the key securely in local storage (encrypted in a real app)
      this._storeConversationKey(conversationId, keyString);
      
      return keyString;
    } catch (error) {
      console.error('Failed to setup conversation encryption:', error);
      throw new Error('Encryption setup failed');
    }
  },
  
  // Get the encryption key for a conversation
  async getConversationKey(conversationId: string): Promise<CryptoKey | null> {
    const keyString = this._retrieveConversationKey(conversationId);
    if (!keyString) return null;
    
    try {
      return await this.importKey(keyString);
    } catch (error) {
      console.error('Failed to retrieve conversation key:', error);
      return null;
    }
  },
  
  // Helper to store conversation key
  _storeConversationKey(conversationId: string, keyString: string): void {
    // In a production app, this key would be further encrypted with a master key
    localStorage.setItem(`chat_encryption_${conversationId}`, keyString);
  },
  
  // Helper to retrieve conversation key
  _retrieveConversationKey(conversationId: string): string | null {
    return localStorage.getItem(`chat_encryption_${conversationId}`);
  },
  
  // Helper to convert ArrayBuffer to Base64 string
  _arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  },
  
  // Helper to convert Base64 string to ArrayBuffer
  _base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  },
};
