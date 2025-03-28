
import React from 'react';
import { FileIcon, Download } from 'lucide-react';
import { formatBytes } from '@/utils/helpers/formatters';
import { ChatMessage } from './types';

interface FileAttachmentItemProps {
  file: NonNullable<ChatMessage['attachments']>[0];
  onDownload?: (file: NonNullable<ChatMessage['attachments']>[0]) => void;
}

const FileAttachmentItem: React.FC<FileAttachmentItemProps> = ({ file, onDownload }) => {
  const handleDownload = () => {
    if (onDownload) {
      onDownload(file);
    } else {
      // Default download behavior
      window.open(file.url, '_blank');
    }
  };

  return (
    <div className="flex items-center rounded-md border p-2 bg-background/80 max-w-sm">
      <div className="flex h-9 w-9 items-center justify-center rounded-md border bg-background">
        <FileIcon className="h-5 w-5" />
      </div>
      <div className="ml-3 flex-1 overflow-hidden">
        <p className="text-sm font-medium truncate">{file.name}</p>
        <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
      </div>
      <button
        onClick={handleDownload}
        className="ml-2 flex h-7 w-7 items-center justify-center rounded-md hover:bg-accent"
      >
        <Download className="h-4 w-4" />
        <span className="sr-only">Download</span>
      </button>
    </div>
  );
};

export default FileAttachmentItem;
