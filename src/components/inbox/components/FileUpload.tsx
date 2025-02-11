
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, FileIcon, ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFilesAdded: (files: File[]) => void;
  uploadProgress: Record<string, number>;
  onRemoveFile: (file: File) => void;
  files: File[];
  disabled?: boolean;
}

const FileUpload = ({ onFilesAdded, uploadProgress, onRemoveFile, files, disabled }: FileUploadProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesAdded(acceptedFiles);
  }, [onFilesAdded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled
  });

  const renderPreview = (file: File) => {
    const progress = uploadProgress[file.name] || 0;
    const isImage = file.type.startsWith('image/');
    
    return (
      <div key={file.name} className="relative bg-secondary/20 rounded-lg p-2 flex gap-2 items-center">
        {isImage ? (
          <div className="h-12 w-12 rounded overflow-hidden">
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <FileIcon className="h-12 w-12 text-primary" />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{file.name}</p>
          <p className="text-xs text-muted-foreground">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
          {progress > 0 && progress < 100 && (
            <Progress value={progress} className="h-1 mt-1" />
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 absolute top-1 right-1"
          onClick={() => onRemoveFile(file)}
          disabled={disabled}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <div>
      <div 
        {...getRootProps()} 
        className={cn(
          "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors",
          isDragActive && "border-primary bg-primary/5",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {isDragActive
              ? "Drop files here"
              : "Drag and drop files here, or click to select"}
          </p>
        </div>
      </div>
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map(renderPreview)}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
