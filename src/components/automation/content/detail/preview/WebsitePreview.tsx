
import React from 'react';
import { WebsitePreviewProps } from '@/types/content';

export const WebsitePreview = ({ website, url }: WebsitePreviewProps) => {
  const websiteUrl = url || website;
  
  return (
    <div className="w-full">
      <iframe 
        src={websiteUrl} 
        className="w-full h-[600px] border rounded"
        title="Website Preview"
      ></iframe>
    </div>
  );
};
