
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface FileAttachment {
  id: string;
  file: File;
  previewUrl?: string;
  uploadProgress: number;
  error?: string;
}

/**
 * Hook for managing file attachments in chat
 */
export const useFileAttachments = () => {
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  // Add attachments to the list
  const addAttachments = useCallback((files: File[]) => {
    const newAttachments = files.map(file => {
      // Create preview URL for images
      let previewUrl: string | undefined = undefined;
      if (file.type.startsWith('image/')) {
        previewUrl = URL.createObjectURL(file);
      }
      
      return {
        id: uuidv4(),
        file,
        previewUrl,
        uploadProgress: 0
      };
    });
    
    setAttachments(prev => [...prev, ...newAttachments]);
  }, []);
  
  // Remove an attachment by ID
  const removeAttachment = useCallback((id: string) => {
    setAttachments(prev => {
      const attachment = prev.find(a => a.id === id);
      
      // Revoke object URL if it exists
      if (attachment?.previewUrl) {
        URL.revokeObjectURL(attachment.previewUrl);
      }
      
      return prev.filter(a => a.id !== id);
    });
  }, []);
  
  // Clear all attachments
  const clearAttachments = useCallback(() => {
    // Revoke all preview URLs
    attachments.forEach(attachment => {
      if (attachment.previewUrl) {
        URL.revokeObjectURL(attachment.previewUrl);
      }
    });
    
    setAttachments([]);
  }, [attachments]);
  
  // Simulate uploading attachments
  const uploadAttachments = useCallback(async (conversationId: string): Promise<string[]> => {
    if (attachments.length === 0) return [];
    
    setIsUploading(true);
    
    try {
      // In a real app, this would upload files to a server
      // For demo purposes, we'll simulate the upload process
      const uploadedUrls: string[] = [];
      
      for (let i = 0; i < attachments.length; i++) {
        const attachment = attachments[i];
        
        // Simulate progress updates
        for (let progress = 0; progress <= 100; progress += 10) {
          setAttachments(prev => prev.map(a => 
            a.id === attachment.id ? { ...a, uploadProgress: progress } : a
          ));
          
          // Small delay to simulate network
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        // Add fake URL for the uploaded file
        uploadedUrls.push(`https://example.com/uploads/${conversationId}/${attachment.id}-${attachment.file.name}`);
      }
      
      return uploadedUrls;
    } catch (error) {
      console.error('Error uploading attachments:', error);
      return [];
    } finally {
      setIsUploading(false);
    }
  }, [attachments]);
  
  return {
    attachments,
    isUploading,
    addAttachments,
    removeAttachment,
    clearAttachments,
    uploadAttachments
  };
};
