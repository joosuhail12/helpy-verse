
import React from 'react';
import { File, Download } from 'lucide-react';
import { FileAttachment } from '../../types';
import { formatFileSize } from '../../utils/messageFormatter';

interface FileAttachmentItemProps {
  attachment: FileAttachment;
}

const FileAttachmentItem: React.FC<FileAttachmentItemProps> = ({ attachment }) => {
  const isImage = attachment.type.startsWith('image/');
  
  return (
    <div className="flex items-center p-2 bg-white bg-opacity-20 rounded">
      {isImage ? (
        <img 
          src={attachment.url} 
          alt={attachment.name} 
          className="w-8 h-8 object-cover rounded"
        />
      ) : (
        <File size={24} className="text-white text-opacity-80" />
      )}
      
      <div className="ml-2 flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{attachment.name}</div>
        <div className="text-xs opacity-80">{formatFileSize(attachment.size)}</div>
      </div>
      
      <a 
        href={attachment.url}
        download={attachment.name}
        className="p-1 rounded-full hover:bg-white hover:bg-opacity-20"
        onClick={(e) => e.stopPropagation()}
      >
        <Download size={16} />
      </a>
    </div>
  );
};

export default FileAttachmentItem;
