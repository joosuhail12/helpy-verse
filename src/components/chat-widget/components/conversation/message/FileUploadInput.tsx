
import React, { useState, useRef } from 'react';
import { Paperclip, X, FileIcon, Image as ImageIcon } from 'lucide-react';

interface FileUploadInputProps {
  onFileSelect: (files: File[]) => void;
  disabled?: boolean;
  maxFileSize?: number; // in MB
  allowedTypes?: string[];
}

const FileUploadInput: React.FC<FileUploadInputProps> = ({
  onFileSelect,
  disabled = false,
  maxFileSize = 5, // Default 5MB
  allowedTypes = ['image/*', 'application/pdf', 'text/*', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      setError(`File too large. Maximum size is ${maxFileSize}MB.`);
      return false;
    }
    
    // Check file type
    const isAllowedType = allowedTypes.some(type => {
      if (type.includes('*')) {
        const mainType = type.split('/')[0];
        return file.type.startsWith(mainType);
      }
      return file.type === type;
    });
    
    if (!isAllowedType) {
      setError('File type not supported.');
      return false;
    }
    
    return true;
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter(validateFile);
      
      if (validFiles.length > 0) {
        setSelectedFiles(prev => [...prev, ...validFiles]);
        onFileSelect(validFiles);
      }
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const removeFile = (index: number) => {
    setSelectedFiles(prev => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  return (
    <div className="w-full">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
        disabled={disabled}
        accept={allowedTypes.join(',')}
      />
      
      {/* Clickable button */}
      <button
        type="button"
        onClick={handleButtonClick}
        disabled={disabled}
        className="p-2 text-gray-500 rounded-full hover:bg-gray-100 transition-colors focus:outline-none disabled:opacity-50"
        aria-label="Attach file"
      >
        <Paperclip className="h-5 w-5" />
      </button>
      
      {/* Error message */}
      {error && (
        <div className="text-xs text-red-500 mt-1">{error}</div>
      )}
      
      {/* Selected files preview */}
      {selectedFiles.length > 0 && (
        <div className="mt-2 space-y-2">
          {selectedFiles.map((file, index) => (
            <div 
              key={index} 
              className="flex items-center p-2 bg-gray-50 rounded border border-gray-200"
            >
              {file.type.startsWith('image/') ? (
                <ImageIcon className="h-4 w-4 mr-2 text-gray-500" />
              ) : (
                <FileIcon className="h-4 w-4 mr-2 text-gray-500" />
              )}
              <div className="flex-1 truncate">
                <span className="text-xs">{file.name}</span>
                <span className="text-xs text-gray-500 ml-1">
                  ({formatFileSize(file.size)})
                </span>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="ml-2 text-gray-400 hover:text-gray-600"
                aria-label="Remove file"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploadInput;
