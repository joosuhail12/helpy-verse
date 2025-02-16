
import { useDropzone } from 'react-dropzone';
import { FileIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

export const DropZone = ({ onFilesSelected, disabled }: DropZoneProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onFilesSelected,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors",
        isDragActive && "border-primary bg-primary/5",
        disabled && "pointer-events-none opacity-50"
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-2">
        <FileIcon className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {isDragActive
            ? "Drop the file here"
            : "Drag and drop a file here, or click to select"}
        </p>
        <p className="text-xs text-muted-foreground">
          Supported formats: PDF, DOC, DOCX, TXT
        </p>
      </div>
    </div>
  );
};

