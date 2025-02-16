
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { FileIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onSuccess: () => void;
}

export const FileUpload = ({ onSuccess }: FileUploadProps) => {
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
  });

  const removeFile = () => {
    setFiles([]);
    setUploadProgress(0);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setUploadProgress(i);
      }

      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="p-6">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors",
          isDragActive && "border-primary bg-primary/5",
          isUploading && "pointer-events-none opacity-50"
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

      {files.length > 0 && (
        <div className="mt-4 space-y-4">
          <div className="relative bg-secondary/20 rounded-lg p-3 flex gap-2 items-center">
            <FileIcon className="h-8 w-8 text-primary" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{files[0].name}</p>
              <p className="text-xs text-muted-foreground">
                {(files[0].size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={removeFile}
              disabled={isUploading}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {uploadProgress > 0 && (
            <Progress value={uploadProgress} className="h-1" />
          )}

          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? "Uploading..." : "Upload File"}
          </Button>
        </div>
      )}
    </Card>
  );
};
