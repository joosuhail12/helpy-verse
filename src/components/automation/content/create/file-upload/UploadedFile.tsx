
import { Button } from '@/components/ui/button';
import { FileIcon, X } from 'lucide-react';

interface UploadedFileProps {
  file: File;
  onRemove: () => void;
  disabled?: boolean;
}

export const UploadedFile = ({ file, onRemove, disabled }: UploadedFileProps) => {
  return (
    <div className="relative bg-secondary/20 rounded-lg p-3 flex gap-2 items-center">
      <FileIcon className="h-8 w-8 text-primary" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{file.name}</p>
        <p className="text-xs text-muted-foreground">
          {(file.size / 1024 / 1024).toFixed(2)} MB
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        disabled={disabled}
        className="h-8 w-8"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

