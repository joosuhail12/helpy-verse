
class EncryptionService {
  private keysKey = 'crypto_keys';
  private delimiter = '.';
  
  // Initialize encryption
  public async initialize(): Promise<boolean> {
    try {
      // Check if crypto is available
      if (!window.crypto || !window.crypto.subtle) {
        console.error('Web Crypto API is not available in this browser');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Failed to initialize encryption:', error);
      return false;
    }
  }
  
  // Generate a new encryption key
  public async generateKey(): Promise<CryptoKey> {
    return window.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256
      },
      true,
      ['encrypt', 'decrypt']
    );
  }
  
  // Export a key to raw format
  private async exportKey(key: CryptoKey): Promise<ArrayBuffer> {
    return window.crypto.subtle.exportKey('raw', key);
  }
  
  // Import a key from raw format
  private async importKey(keyData: ArrayBuffer): Promise<CryptoKey> {
    return window.crypto.subtle.importKey(
      'raw',
      keyData,
      {
        name: 'AES-GCM',
        length: 256
      },
      true,
      ['encrypt', 'decrypt']
    );
  }
  
  // Convert ArrayBuffer to Base64 string
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
  
  // Convert Base64 string to ArrayBuffer
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
  
  // Set up encryption for a conversation
  public async setupConversationEncryption(conversationId: string): Promise<boolean> {
    try {
      // Generate a new key
      const key = await this.generateKey();
      
      // Export the key to raw format
      const keyData = await this.exportKey(key);
      
      // Convert to Base64 for storage
      const keyBase64 = this.arrayBufferToBase64(keyData);
      
      // Store the key with version info
      const keyInfo = {
        key: keyBase64,
        version: 1,
        createdAt: new Date().toISOString()
      };
      
      // Get existing keys or initialize new
      const keysStr = localStorage.getItem(this.keysKey);
      let keys = keysStr ? JSON.parse(keysStr) : {};
      
      // Add the new key
      keys[conversationId] = {
        keys: [keyInfo],
        currentVersion: 1
      };
      
      // Save back to storage
      localStorage.setItem(this.keysKey, JSON.stringify(keys));
      
      return true;
    } catch (error) {
      console.error('Failed to set up conversation encryption:', error);
      return false;
    }
  }
  
  // Get the encryption key for a conversation
  public async getConversationKey(conversationId: string): Promise<CryptoKey | null> {
    try {
      // Get stored keys
      const keysStr = localStorage.getItem(this.keysKey);
      if (!keysStr) return null;
      
      const keys = JSON.parse(keysStr);
      if (!keys[conversationId]) return null;
      
      // Get current key version
      const currentVersion = keys[conversationId].currentVersion;
      const keyInfo = keys[conversationId].keys.find((k: any) => k.version === currentVersion);
      
      if (!keyInfo) return null;
      
      // Convert Base64 back to ArrayBuffer
      const keyData = this.base64ToArrayBuffer(keyInfo.key);
      
      // Import the key
      return this.importKey(keyData);
    } catch (error) {
      console.error('Failed to get conversation key:', error);
      return null;
    }
  }
  
  // Encrypt a message
  public async encryptMessage(message: string, key: CryptoKey): Promise<any> {
    try {
      // Generate a random IV for each encryption
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      
      // Encode the message as UTF-8
      const messageData = new TextEncoder().encode(message);
      
      // Encrypt the message
      const ciphertext = await window.crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv
        },
        key,
        messageData
      );
      
      // Return the IV and ciphertext as Base64 strings
      return {
        iv: this.arrayBufferToBase64(iv),
        ciphertext: this.arrayBufferToBase64(ciphertext),
        keyVersion: 1 // Assuming version 1 for simplicity
      };
    } catch (error) {
      console.error('Failed to encrypt message:', error);
      throw error;
    }
  }
  
  // Decrypt a message
  public async decryptMessage(encrypted: any, key: CryptoKey): Promise<string> {
    try {
      // Convert Base64 strings back to ArrayBuffers
      const iv = this.base64ToArrayBuffer(encrypted.iv);
      const ciphertext = this.base64ToArrayBuffer(encrypted.ciphertext);
      
      // Decrypt the message
      const decrypted = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv
        },
        key,
        ciphertext
      );
      
      // Decode the decrypted data as UTF-8
      return new TextDecoder().decode(decrypted);
    } catch (error) {
      console.error('Failed to decrypt message:', error);
      throw error;
    }
  }
}

export const encryptionService = new EncryptionService();
export default encryptionService;
