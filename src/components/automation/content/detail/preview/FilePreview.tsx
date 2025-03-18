
import React from 'react';
import { Button } from '@/components/ui/button';
import { DownloadCloud, File } from 'lucide-react';
import type { Content } from '@/types/content';

interface FilePreviewProps {
  content: Content;
}

export function FilePreview({ content }: FilePreviewProps) {
  const isImage = (): boolean => {
    const title = content.title.toLowerCase();
    return title.endsWith('.jpg') || 
           title.endsWith('.jpeg') || 
           title.endsWith('.png') || 
           title.endsWith('.gif') || 
           title.endsWith('.svg');
  };

  const isPdf = (): boolean => {
    return content.title.toLowerCase().endsWith('.pdf');
  };

  const renderPreview = () => {
    if (isImage()) {
      return (
        <div className="flex justify-center p-4 bg-black/5 rounded-md">
          <img 
            src={content.content || '/placeholder.svg'} 
            alt={content.title}
            className="max-h-[400px] object-contain" 
          />
        </div>
      );
    }

    if (isPdf()) {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-black/5 rounded-md min-h-[300px]">
          <File className="h-16 w-16 text-red-500 mb-4" />
          <h3 className="text-lg font-medium mb-2">{content.title}</h3>
          <p className="text-muted-foreground mb-4">PDF Document</p>
          <Button>
            <DownloadCloud className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center p-8 bg-black/5 rounded-md min-h-[300px]">
        <File className="h-16 w-16 text-blue-500 mb-4" />
        <h3 className="text-lg font-medium mb-2">{content.title}</h3>
        <p className="text-muted-foreground mb-4">File Preview Not Available</p>
        <Button>
          <DownloadCloud className="mr-2 h-4 w-4" />
          Download File
        </Button>
      </div>
    );
  };

  return (
    <div>
      {renderPreview()}
    </div>
  );
}
