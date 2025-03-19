
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { Content } from '@/types/content';

interface FilePreviewProps {
  content: Content;
}

export function FilePreview({ content }: FilePreviewProps) {
  const handleDownload = () => {
    // Create a mock download functionality
    // In a real app, this would trigger a file download
    alert(`Downloading file: ${content.title}`);
  };

  const getFileIcon = () => {
    const filename = content.title.toLowerCase();
    // Return different icons based on file extension
    if (filename.endsWith('.pdf')) return '📄';
    if (filename.endsWith('.doc') || filename.endsWith('.docx')) return '📝';
    if (filename.endsWith('.xls') || filename.endsWith('.xlsx')) return '📊';
    if (filename.endsWith('.ppt') || filename.endsWith('.pptx')) return '📽️';
    if (filename.endsWith('.jpg') || filename.endsWith('.png') || filename.endsWith('.gif')) return '🖼️';
    return '📁';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download File
        </Button>
      </div>

      <Card className="flex flex-col items-center justify-center py-12 px-4 border-dashed">
        <div className="text-6xl mb-4">{getFileIcon()}</div>
        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">{content.title}</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Preview not available. Click the download button to access this file.
        </p>
      </Card>
    </div>
  );
}
