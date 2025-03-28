
/**
 * Encryption Service
 * Provides end-to-end encryption for chat messages
 * Uses Web Crypto API for secure cryptographic operations
 */

// Base encryption key size in bytes (256-bit)
const KEY_SIZE = 32;
// IV size in bytes
const IV_SIZE = 12;
// Default key rotation period in milliseconds (7 days)
const DEFAULT_KEY_ROTATION_PERIOD = 7 * 24 * 60 * 60 * 1000;
// Key version prefix
const KEY_VERSION_PREFIX = 'key_version_';
// Current key version storage key
const CURRENT_KEY_VERSION = 'current_key_version';

interface EncryptedData {
  iv: string;      // Base64 encoded initialization vector
  data: string;    // Base64 encoded encrypted data
  signature?: string; // Base64 encoded signature
  keyVersion?: number; // Key version used for encryption
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
  
  // Encrypt message with versioned key
  async encryptMessage(message: string, key: CryptoKey, keyVersion?: number): Promise<EncryptedData> {
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
      
      // Return the encrypted data, IV, and key version as base64 strings
      return {
        iv: this._arrayBufferToBase64(iv),
        data: this._arrayBufferToBase64(encryptedData),
        keyVersion: keyVersion || this._getCurrentKeyVersion()
      };
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Message encryption failed');
    }
  },
  
  // Decrypt message with specific key version
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
      
      // Store the key securely with version information
      const keyVersion = this._getNextKeyVersion();
      this._storeVersionedConversationKey(conversationId, keyString, keyVersion);
      this._setCurrentKeyVersion(keyVersion);
      
      return keyString;
    } catch (error) {
      console.error('Failed to setup conversation encryption:', error);
      throw new Error('Encryption setup failed');
    }
  },
  
  // Set up key rotation for a conversation
  async setupKeyRotation(conversationId: string, rotationPeriod = DEFAULT_KEY_ROTATION_PERIOD): void {
    try {
      const lastRotation = this._getLastKeyRotationTimestamp(conversationId);
      const now = Date.now();
      
      // If key rotation is due or has never been done
      if (!lastRotation || (now - lastRotation) > rotationPeriod) {
        await this.rotateConversationKey(conversationId);
      }
      
      // Schedule next rotation
      setTimeout(() => {
        this.rotateConversationKey(conversationId);
      }, rotationPeriod);
    } catch (error) {
      console.error('Failed to setup key rotation:', error);
    }
  },
  
  // Rotate the encryption key for a conversation
  async rotateConversationKey(conversationId: string): Promise<string> {
    try {
      // Generate a new encryption key
      const key = await this.generateEncryptionKey();
      
      // Export the key to a string
      const keyString = await this.exportKey(key);
      
      // Store the key securely with a new version
      const keyVersion = this._getNextKeyVersion();
      this._storeVersionedConversationKey(conversationId, keyString, keyVersion);
      this._setCurrentKeyVersion(keyVersion);
      
      // Update last rotation timestamp
      this._updateKeyRotationTimestamp(conversationId);
      
      console.log(`Key rotated for conversation ${conversationId}, new version: ${keyVersion}`);
      return keyString;
    } catch (error) {
      console.error('Failed to rotate conversation key:', error);
      throw new Error('Key rotation failed');
    }
  },
  
  // Get the latest encryption key for a conversation
  async getLatestConversationKey(conversationId: string): Promise<CryptoKey | null> {
    const version = this._getCurrentKeyVersion();
    return this.getConversationKeyByVersion(conversationId, version);
  },
  
  // Get a specific version of a conversation key
  async getConversationKeyByVersion(conversationId: string, version: number): Promise<CryptoKey | null> {
    const keyString = this._retrieveVersionedConversationKey(conversationId, version);
    if (!keyString) return null;
    
    try {
      return await this.importKey(keyString);
    } catch (error) {
      console.error(`Failed to retrieve conversation key version ${version}:`, error);
      return null;
    }
  },
  
  // Get the encryption key for a conversation (legacy support)
  async getConversationKey(conversationId: string): Promise<CryptoKey | null> {
    // First try to get versioned key
    const latestKey = await this.getLatestConversationKey(conversationId);
    if (latestKey) return latestKey;
    
    // Fall back to legacy key
    const keyString = this._retrieveConversationKey(conversationId);
    if (!keyString) return null;
    
    try {
      return await this.importKey(keyString);
    } catch (error) {
      console.error('Failed to retrieve legacy conversation key:', error);
      return null;
    }
  },
  
  // Re-encrypt data with the latest key
  async reEncryptMessage(message: EncryptedData, conversationId: string): Promise<EncryptedData | null> {
    try {
      // Get the source key by version
      const sourceKeyVersion = message.keyVersion || 1;
      const sourceKey = await this.getConversationKeyByVersion(conversationId, sourceKeyVersion);
      
      if (!sourceKey) {
        console.error(`Source key version ${sourceKeyVersion} not found for re-encryption`);
        return null;
      }
      
      // Decrypt with source key
      const decryptedContent = await this.decryptMessage(message, sourceKey);
      
      // Get the latest key
      const latestKey = await this.getLatestConversationKey(conversationId);
      if (!latestKey) {
        console.error('Latest key not found for re-encryption');
        return null;
      }
      
      // Re-encrypt with latest key
      const latestVersion = this._getCurrentKeyVersion();
      return await this.encryptMessage(decryptedContent, latestKey, latestVersion);
    } catch (error) {
      console.error('Re-encryption failed:', error);
      return null;
    }
  },
  
  // Get the next key version
  _getNextKeyVersion(): number {
    const currentVersion = this._getCurrentKeyVersion();
    return currentVersion + 1;
  },
  
  // Get the current key version
  _getCurrentKeyVersion(): number {
    const version = localStorage.getItem(CURRENT_KEY_VERSION);
    return version ? parseInt(version, 10) : 1;
  },
  
  // Set the current key version
  _setCurrentKeyVersion(version: number): void {
    localStorage.setItem(CURRENT_KEY_VERSION, version.toString());
  },
  
  // Helper to store versioned conversation key
  _storeVersionedConversationKey(conversationId: string, keyString: string, version: number): void {
    localStorage.setItem(`chat_encryption_${conversationId}_${KEY_VERSION_PREFIX}${version}`, keyString);
  },
  
  // Helper to retrieve versioned conversation key
  _retrieveVersionedConversationKey(conversationId: string, version: number): string | null {
    return localStorage.getItem(`chat_encryption_${conversationId}_${KEY_VERSION_PREFIX}${version}`);
  },
  
  // Helper to update key rotation timestamp
  _updateKeyRotationTimestamp(conversationId: string): void {
    localStorage.setItem(`chat_key_rotation_${conversationId}`, Date.now().toString());
  },
  
  // Helper to get last key rotation timestamp
  _getLastKeyRotationTimestamp(conversationId: string): number | null {
    const timestamp = localStorage.getItem(`chat_key_rotation_${conversationId}`);
    return timestamp ? parseInt(timestamp, 10) : null;
  },
  
  // Helper to store conversation key (legacy support)
  _storeConversationKey(conversationId: string, keyString: string): void {
    localStorage.setItem(`chat_encryption_${conversationId}`, keyString);
  },
  
  // Helper to retrieve conversation key (legacy support)
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
