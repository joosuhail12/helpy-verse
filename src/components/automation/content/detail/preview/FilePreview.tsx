
import React from 'react';
import { FilePreviewProps } from '@/types/content';

export const FilePreview = ({ file, url }: FilePreviewProps) => {
  const fileUrl = url || file;
  
  const getFileExtension = (url: string): string => {
    const parts = url.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
  };

  const extension = getFileExtension(fileUrl);
  const isPdf = extension === 'pdf';
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension);
  
  return (
    <div className="w-full">
      {isPdf && (
        <iframe 
          src={fileUrl} 
          className="w-full h-[500px] border rounded"
          title="PDF Document"
        ></iframe>
      )}
      
      {isImage && (
        <div className="flex justify-center">
          <img 
            src={fileUrl} 
            alt="File preview" 
            className="max-w-full max-h-[500px] object-contain rounded"
          />
        </div>
      )}
      
      {!isPdf && !isImage && (
        <div className="text-center p-8 bg-gray-100 dark:bg-gray-800 rounded">
          <p>Preview not available for this file type</p>
          <a 
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            Download File
          </a>
        </div>
      )}
    </div>
  );
};
