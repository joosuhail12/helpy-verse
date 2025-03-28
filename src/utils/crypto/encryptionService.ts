
/**
 * Encryption service for end-to-end encryption
 */

class EncryptionService {
  private keyPrefix = 'encryption_key_';
  private keyMetaPrefix = 'encryption_meta_';
  
  // Set up encryption for a conversation
  public async setupConversationEncryption(conversationId: string): Promise<string> {
    try {
      // Generate a new encryption key
      const keyVersion = this.generateKeyVersion();
      
      // Generate a random encryption key
      const key = await this.generateEncryptionKey();
      
      // Store the key securely
      this.storeKey(conversationId, keyVersion, key);
      
      // Store metadata about the key
      this.storeKeyMetadata(conversationId, keyVersion);
      
      return keyVersion;
    } catch (error) {
      console.error('Failed to set up conversation encryption:', error);
      throw error;
    }
  }
  
  // Check if we have an encryption key for this conversation
  public async hasConversationKey(conversationId: string): Promise<boolean> {
    const metaKey = `${this.keyMetaPrefix}${conversationId}`;
    return localStorage.getItem(metaKey) !== null;
  }
  
  // Get the current key version for a conversation
  public async getCurrentKeyVersion(conversationId: string): Promise<string | null> {
    try {
      const metaKey = `${this.keyMetaPrefix}${conversationId}`;
      const metaStr = localStorage.getItem(metaKey);
      
      if (!metaStr) return null;
      
      const meta = JSON.parse(metaStr);
      return meta.currentKeyVersion;
    } catch (error) {
      console.error('Failed to get current key version:', error);
      return null;
    }
  }
  
  // Get the encryption key for a conversation
  public async getConversationKey(conversationId: string): Promise<CryptoKey | null> {
    try {
      const keyVersion = await this.getCurrentKeyVersion(conversationId);
      
      if (!keyVersion) return null;
      
      return this.retrieveKey(conversationId, keyVersion);
    } catch (error) {
      console.error('Failed to get conversation key:', error);
      return null;
    }
  }
  
  // Check if a key should be rotated based on age
  public async shouldRotateKey(conversationId: string, rotationPeriod: number): Promise<boolean> {
    try {
      const metaKey = `${this.keyMetaPrefix}${conversationId}`;
      const metaStr = localStorage.getItem(metaKey);
      
      if (!metaStr) return true;
      
      const meta = JSON.parse(metaStr);
      const keyCreatedAt = new Date(meta.createdAt).getTime();
      
      return Date.now() - keyCreatedAt > rotationPeriod;
    } catch (error) {
      console.error('Failed to check key rotation:', error);
      return false;
    }
  }
  
  // Rotate the encryption key for a conversation
  public async rotateEncryptionKey(conversationId: string): Promise<string> {
    try {
      // Generate a new key version
      const newKeyVersion = this.generateKeyVersion();
      
      // Generate a new encryption key
      const newKey = await this.generateEncryptionKey();
      
      // Store the new key
      this.storeKey(conversationId, newKeyVersion, newKey);
      
      // Update metadata
      this.storeKeyMetadata(conversationId, newKeyVersion);
      
      return newKeyVersion;
    } catch (error) {
      console.error('Failed to rotate encryption key:', error);
      throw error;
    }
  }
  
  // Encrypt a message
  public async encryptMessage(
    message: string, 
    key: CryptoKey
  ): Promise<{ ciphertext: string; iv: string; keyVersion: string }> {
    try {
      // Generate a random initialization vector
      const iv = crypto.getRandomValues(new Uint8Array(12));
      
      // Convert message to ArrayBuffer
      const encoder = new TextEncoder();
      const data = encoder.encode(message);
      
      // Encrypt the message
      const ciphertext = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        data
      );
      
      // Convert to base64 for storage
      const base64Ciphertext = this.arrayBufferToBase64(ciphertext);
      const base64Iv = this.arrayBufferToBase64(iv);
      
      return {
        ciphertext: base64Ciphertext,
        iv: base64Iv,
        keyVersion: 'current' // In a real app, you'd track the key version
      };
    } catch (error) {
      console.error('Failed to encrypt message:', error);
      throw error;
    }
  }
  
  // Decrypt a message
  public async decryptMessage(
    { ciphertext, iv }: { ciphertext: string; iv: string },
    key: CryptoKey
  ): Promise<string> {
    try {
      // Convert from base64
      const ciphertextBuffer = this.base64ToArrayBuffer(ciphertext);
      const ivBuffer = this.base64ToArrayBuffer(iv);
      
      // Decrypt the message
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: ivBuffer },
        key,
        ciphertextBuffer
      );
      
      // Convert ArrayBuffer to string
      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } catch (error) {
      console.error('Failed to decrypt message:', error);
      throw error;
    }
  }
  
  // Helper: Generate a random key version
  private generateKeyVersion(): string {
    return `key_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
  
  // Helper: Generate a new encryption key
  private async generateEncryptionKey(): Promise<CryptoKey> {
    return crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  }
  
  // Helper: Store a key securely
  private async storeKey(conversationId: string, keyVersion: string, key: CryptoKey): Promise<void> {
    try {
      // Export the key to raw format
      const exportedKey = await crypto.subtle.exportKey('raw', key);
      
      // Convert to base64 for storage
      const base64Key = this.arrayBufferToBase64(exportedKey);
      
      // Store in localStorage (in a real app, you'd use a more secure storage)
      const storageKey = `${this.keyPrefix}${conversationId}_${keyVersion}`;
      localStorage.setItem(storageKey, base64Key);
    } catch (error) {
      console.error('Failed to store key:', error);
      throw error;
    }
  }
  
  // Helper: Store metadata about the key
  private storeKeyMetadata(conversationId: string, keyVersion: string): void {
    try {
      const metaKey = `${this.keyMetaPrefix}${conversationId}`;
      
      const metadata = {
        conversationId,
        currentKeyVersion: keyVersion,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem(metaKey, JSON.stringify(metadata));
    } catch (error) {
      console.error('Failed to store key metadata:', error);
      throw error;
    }
  }
  
  // Helper: Retrieve a key
  private async retrieveKey(conversationId: string, keyVersion: string): Promise<CryptoKey | null> {
    try {
      const storageKey = `${this.keyPrefix}${conversationId}_${keyVersion}`;
      const base64Key = localStorage.getItem(storageKey);
      
      if (!base64Key) return null;
      
      // Convert from base64
      const keyBuffer = this.base64ToArrayBuffer(base64Key);
      
      // Import the key
      return crypto.subtle.importKey(
        'raw',
        keyBuffer,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
      );
    } catch (error) {
      console.error('Failed to retrieve key:', error);
      return null;
    }
  }
  
  // Helper: Convert ArrayBuffer to base64
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
  
  // Helper: Convert base64 to ArrayBuffer
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
}

export const encryptionService = new EncryptionService();
export default encryptionService;
