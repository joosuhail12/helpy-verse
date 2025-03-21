
import React from 'react';
import type { Content } from '@/types/content';

interface FilePreviewProps {
  content: Content;
}

export const FilePreview = ({ content }: FilePreviewProps) => {
  if (!content.content) return null;

  const fileExtension = content.content.split('.').pop()?.toLowerCase();
  
  if (fileExtension === 'pdf') {
    return (
      <div className="aspect-[4/3] w-full border rounded-lg overflow-hidden">
        <iframe
          src={content.content}
          className="w-full h-full"
          title="PDF Preview"
        />
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <a
        href={content.content}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline"
      >
        Open Document
      </a>
    </div>
  );
};
