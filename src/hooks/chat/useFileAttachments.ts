
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface FileAttachment {
  id: string;
  file: File;
  previewUrl?: string;
  uploadProgress?: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  error?: string;
}

/**
 * Hook for managing file attachments in chat
 */
export const useFileAttachments = () => {
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  // Add new file attachments
  const addAttachments = useCallback((files: File[]) => {
    const newAttachments = files.map(file => {
      // Create preview URL for images
      let previewUrl: string | undefined;
      if (file.type.startsWith('image/')) {
        previewUrl = URL.createObjectURL(file);
      }
      
      return {
        id: uuidv4(),
        file,
        previewUrl,
        status: 'idle' as const,
        uploadProgress: 0
      };
    });
    
    setAttachments(prev => [...prev, ...newAttachments]);
    return newAttachments;
  }, []);
  
  // Remove an attachment
  const removeAttachment = useCallback((id: string) => {
    setAttachments(prev => {
      const attachment = prev.find(a => a.id === id);
      
      // Revoke object URL if it exists to prevent memory leaks
      if (attachment?.previewUrl) {
        URL.revokeObjectURL(attachment.previewUrl);
      }
      
      return prev.filter(a => a.id !== id);
    });
  }, []);
  
  // Clear all attachments
  const clearAttachments = useCallback(() => {
    // Revoke all object URLs
    attachments.forEach(attachment => {
      if (attachment.previewUrl) {
        URL.revokeObjectURL(attachment.previewUrl);
      }
    });
    
    setAttachments([]);
  }, [attachments]);
  
  // Update attachment status
  const updateAttachmentStatus = useCallback((
    id: string, 
    status: FileAttachment['status'], 
    progress?: number, 
    error?: string
  ) => {
    setAttachments(prev => 
      prev.map(attachment => 
        attachment.id === id 
          ? { 
              ...attachment, 
              status, 
              uploadProgress: progress !== undefined ? progress : attachment.uploadProgress,
              error 
            } 
          : attachment
      )
    );
  }, []);
  
  // Upload attachments to server
  const uploadAttachments = useCallback(async (
    conversationId: string, 
    onUploadProgress?: (percentage: number) => void
  ): Promise<string[]> => {
    if (attachments.length === 0) return [];
    
    setIsUploading(true);
    const filesToUpload = attachments.filter(a => a.status === 'idle');
    
    // In a real implementation, you would upload files to your server here
    // This is a mock implementation
    try {
      const fileUrls: string[] = [];
      
      for (let i = 0; i < filesToUpload.length; i++) {
        const attachment = filesToUpload[i];
        updateAttachmentStatus(attachment.id, 'uploading', 0);
        
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          updateAttachmentStatus(attachment.id, 'uploading', progress);
          
          if (onUploadProgress) {
            onUploadProgress((progress / 100) * filesToUpload.length);
          }
        }
        
        // Mock file URL
        const fileUrl = `https://api.example.com/files/${conversationId}/${attachment.file.name}`;
        fileUrls.push(fileUrl);
        
        updateAttachmentStatus(attachment.id, 'success', 100);
      }
      
      return fileUrls;
    } catch (error) {
      console.error('Error uploading files:', error);
      
      // Mark all uploading files as errored
      filesToUpload.forEach(attachment => {
        updateAttachmentStatus(
          attachment.id, 
          'error', 
          undefined, 
          error instanceof Error ? error.message : 'Upload failed'
        );
      });
      
      return [];
    } finally {
      setIsUploading(false);
    }
  }, [attachments, updateAttachmentStatus]);
  
  return {
    attachments,
    isUploading,
    addAttachments,
    removeAttachment,
    clearAttachments,
    updateAttachmentStatus,
    uploadAttachments
  };
};
