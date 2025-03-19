
import React from 'react';
import { FilePreviewProps } from '@/types/content';

export const FilePreview: React.FC<FilePreviewProps> = ({ file, url }) => {
  const fileUrl = url || file;
  
  return (
    <div className="w-full">
      <iframe 
        src={fileUrl}
        className="w-full h-[600px] border rounded"
        title="File Preview"
      ></iframe>
    </div>
  );
};
