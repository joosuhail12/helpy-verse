
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ExternalLink, RefreshCw } from 'lucide-react';
import type { Content } from '@/types/content';

interface WebsitePreviewProps {
  content: Content;
}

export function WebsitePreview({ content }: WebsitePreviewProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  
  // Extract website URL from content
  const websiteUrl = content.content || 'https://example.com';
  
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };
  
  const handleOpenExternal = () => {
    window.open(websiteUrl, '_blank');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-muted-foreground">
          {new URL(websiteUrl).hostname}
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleOpenExternal}>
            <ExternalLink className="h-4 w-4 mr-1" />
            Open
          </Button>
        </div>
      </div>
      
      <Card className="w-full overflow-hidden border">
        <div className="w-full bg-gray-100 p-2 border-b flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="border rounded px-2 py-1 text-xs bg-white flex-1 mx-4 text-center overflow-hidden text-ellipsis">
            {websiteUrl}
          </div>
          <div className="w-4"></div>
        </div>
        <iframe
          src={websiteUrl}
          title={`Preview of ${content.title}`}
          className="w-full h-[400px] border-none"
          sandbox="allow-same-origin"
        />
      </Card>
    </div>
  );
}
