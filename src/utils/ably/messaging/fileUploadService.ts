
/**
 * Service for handling file uploads in chat messages
 */
import { v4 as uuidv4 } from 'uuid';

// This would be replaced with actual file storage service in production
const MOCK_UPLOAD_URL = 'https://storage-service.example.com/files';

/**
 * Upload a file to storage service
 * @param file The file to upload
 * @param conversationId The conversation ID the file belongs to
 * @returns Promise with file metadata
 */
export const uploadFile = async (file: File, conversationId: string): Promise<{
  url: string;
  type: string;
  name: string;
  size: number;
  id: string;
}> => {
  // In a real implementation, this would upload to a server or cloud storage
  // For demo purposes, we'll simulate an upload delay and return a mock URL
  return new Promise((resolve) => {
    const fileId = uuidv4();
    
    // Simulate network delay
    setTimeout(() => {
      // Create a local object URL for demo purposes
      const url = URL.createObjectURL(file);
      
      resolve({
        url,
        type: file.type,
        name: file.name,
        size: file.size,
        id: fileId
      });
    }, 1000);
  });
};

/**
 * Upload multiple files
 * @param files Array of files to upload
 * @param conversationId The conversation ID
 * @param onProgress Optional progress callback
 * @returns Promise with array of file metadata
 */
export const uploadFiles = async (
  files: File[],
  conversationId: string,
  onProgress?: (file: File, progress: number) => void
): Promise<Array<{
  url: string;
  type: string;
  name: string;
  size: number;
  id: string;
}>> => {
  const uploads = files.map(async (file) => {
    // Simulate progress updates
    if (onProgress) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        onProgress(file, progress);
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 300);
    }
    
    return uploadFile(file, conversationId);
  });
  
  return Promise.all(uploads);
};
