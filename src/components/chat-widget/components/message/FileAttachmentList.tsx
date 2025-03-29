
import React from 'react';
import FileAttachmentItem from './FileAttachmentItem';
import { FileAttachment } from '../../types';

interface FileAttachmentListProps {
  attachments: FileAttachment[];
}

const FileAttachmentList: React.FC<FileAttachmentListProps> = ({ attachments }) => {
  if (!attachments || attachments.length === 0) return null;
  
  return (
    <div className="mt-2 space-y-2">
      {attachments.map((attachment) => (
        <FileAttachmentItem key={attachment.id} attachment={attachment} />
      ))}
    </div>
  );
};

export default FileAttachmentList;
