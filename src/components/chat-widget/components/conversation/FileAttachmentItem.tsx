
import React, { useState } from 'react';
import { FileIcon, Download, Image as ImageIcon } from 'lucide-react';
import { formatBytes } from '@/utils/helpers/formatters';
import { ChatMessage } from './types';
import { ProgressiveImage } from '@/components/common/ProgressiveImage';

interface FileAttachmentItemProps {
  file: NonNullable<ChatMessage['attachments']>[0];
  onDownload?: (file: NonNullable<ChatMessage['attachments']>[0]) => void;
}

const FileAttachmentItem: React.FC<FileAttachmentItemProps> = ({ file, onDownload }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const isImage = file.type.startsWith('image/');

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
      <div className="flex h-9 w-9 items-center justify-center rounded-md border bg-background overflow-hidden">
        {isImage ? (
          <ProgressiveImage
            src={file.url}
            alt={file.name}
            width={36}
            height={36}
            className="object-cover"
          />
        ) : (
          <FileIcon className="h-5 w-5" />
        )}
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
