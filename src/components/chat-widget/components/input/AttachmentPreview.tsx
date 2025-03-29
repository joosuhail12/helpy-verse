
import React from 'react';
import { File, X } from 'lucide-react';
import { FileAttachment } from '../../types';
import { formatFileSize } from '../../utils/messageFormatter';

interface AttachmentPreviewProps {
  attachment: FileAttachment;
  onRemove: () => void;
}

const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({ attachment, onRemove }) => {
  const isImage = attachment.type.startsWith('image/');
  
  return (
    <div className="flex items-center p-1 bg-gray-100 rounded border">
      {isImage ? (
        <img 
          src={attachment.url} 
          alt={attachment.name} 
          className="w-6 h-6 object-cover rounded"
        />
      ) : (
        <File size={18} className="text-gray-600" />
      )}
      
      <div className="ml-2 mr-1 max-w-[100px]">
        <div className="text-xs font-medium truncate">{attachment.name}</div>
        <div className="text-xs text-gray-500">{formatFileSize(attachment.size)}</div>
      </div>
      
      <button
        type="button"
        onClick={onRemove}
        className="p-1 rounded-full hover:bg-gray-200"
        aria-label="Remove attachment"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default AttachmentPreview;
