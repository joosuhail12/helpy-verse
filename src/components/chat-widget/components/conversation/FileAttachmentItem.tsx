
import React from 'react';
import { FileText, Download, Image, File } from 'lucide-react';
import { FileAttachment } from './types';

interface FileAttachmentItemProps {
  attachment: FileAttachment;
}

const FileAttachmentItem: React.FC<FileAttachmentItemProps> = ({ attachment }) => {
  const isImage = attachment.type.startsWith('image/');
  const isPdf = attachment.type === 'application/pdf';
  
  const formatFileSize = (sizeInBytes: number): string => {
    if (sizeInBytes < 1024) return `${sizeInBytes} B`;
    if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(1)} KB`;
    return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  const getFileIcon = () => {
    if (isImage) return <Image size={18} />;
    if (isPdf) return <FileText size={18} />;
    return <File size={18} />;
  };
  
  const handleDownload = () => {
    window.open(attachment.url, '_blank');
  };
  
  return (
    <div className="flex items-center gap-2 p-2 bg-white/10 rounded-md text-sm">
      <div className="text-white/80">
        {getFileIcon()}
      </div>
      
      <div className="flex-1 overflow-hidden">
        <div className="font-medium truncate">{attachment.name}</div>
        <div className="text-xs text-white/60">{formatFileSize(attachment.size)}</div>
      </div>
      
      <button 
        onClick={handleDownload}
        className="p-1 rounded-full hover:bg-white/20"
        aria-label="Download file"
      >
        <Download size={16} />
      </button>
    </div>
  );
};

export default FileAttachmentItem;
