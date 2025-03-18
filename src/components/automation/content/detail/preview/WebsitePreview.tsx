
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import type { Content } from '@/types/content';

interface WebsitePreviewProps {
  content: Content;
}

export function WebsitePreview({ content }: WebsitePreviewProps) {
  const websiteUrl = content.content || '';
  
  const renderPreview = () => {
    if (!websiteUrl) {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-black/5 rounded-md min-h-[400px]">
          <h3 className="text-lg font-medium mb-2">No Website URL</h3>
          <p className="text-muted-foreground">
            This content doesn't have a website URL to preview.
          </p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground truncate flex-1">
            {websiteUrl}
          </p>
          <Button variant="outline" size="sm" asChild>
            <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </a>
          </Button>
        </div>
        
        <div className="border rounded-md overflow-hidden h-[500px]">
          <iframe
            src={websiteUrl}
            title={content.title}
            className="w-full h-full"
            sandbox="allow-same-origin allow-scripts"
          />
        </div>
      </div>
    );
  };

  return renderPreview();
}
