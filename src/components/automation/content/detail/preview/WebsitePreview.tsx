
import React from 'react';
import type { Content } from '@/types/content';

interface WebsitePreviewProps {
  content: Content;
}

export const WebsitePreview = ({ content }: WebsitePreviewProps) => {
  if (!content.content) return null;

  return (
    <div className="space-y-4">
      <div className="aspect-video w-full border rounded-lg overflow-hidden">
        <iframe
          src={content.content}
          className="w-full h-full"
          title="Website Preview"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
      <p className="text-sm text-muted-foreground break-all">
        URL: {content.content}
      </p>
    </div>
  );
};
