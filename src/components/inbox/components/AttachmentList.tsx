
import React from 'react';
import { Button } from '@/components/ui/button';
import { Paperclip, X } from 'lucide-react';

interface AttachmentListProps {
  files: File[];
  onRemoveFile: (file: File) => void;
  disabled?: boolean;
}

const AttachmentList = ({ files, onRemoveFile, disabled = false }: AttachmentListProps) => {
  if (files.length === 0) return null;

  return (
    <div className="border-t p-3 space-y-2">
      {files.map(file => (
        <div key={file.name} className="flex items-center gap-2 text-sm">
          <Paperclip className="h-4 w-4" />
          <span className="flex-1 truncate">{file.name}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onRemoveFile(file)}
            disabled={disabled}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default AttachmentList;
