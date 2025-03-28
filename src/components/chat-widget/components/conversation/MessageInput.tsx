
import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { Send, Paperclip, X, Lock } from 'lucide-react';
import { validateMessage } from '@/utils/validation/messageValidation';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  encrypted?: boolean;
  onFileUpload?: (files: File[]) => void;
  onRemoveFile?: (file: File) => void;
  attachments?: File[];
  maxLength?: number;
  className?: string;
  isRateLimited?: boolean;
  rateLimitTimeRemaining?: number;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  placeholder = 'Type a message...',
  disabled = false,
  encrypted = false,
  onFileUpload,
  onRemoveFile,
  attachments = [],
  maxLength = 2000,
  className = '',
  isRateLimited = false,
  rateLimitTimeRemaining = 0
}) => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    const result = validateMessage(message, maxLength);
    
    if (!result) {
      setError('Failed to validate message');
      return;
    }
    
    if (result && result.isValid) {
      onSendMessage(result.sanitizedContent);
      setMessage('');
      setError(null);
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } else if (result && result.errors && result.errors.length > 0) {
      setError(result.errors[0]);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && onFileUpload) {
      const filesArray = Array.from(e.target.files);
      onFileUpload(filesArray);
      e.target.value = ''; // Reset the input for future uploads
    }
  };
  
  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`p-3 border-t ${className}`}>
      {error && (
        <div className="mb-2 text-xs text-red-500 p-1 bg-red-50 rounded">
          {error}
        </div>
      )}
      
      {isRateLimited && (
        <div className="mb-2 text-xs text-amber-500 p-1 bg-amber-50 rounded">
          Message rate limit reached. Please wait {Math.ceil(rateLimitTimeRemaining / 1000)} seconds.
        </div>
      )}
      
      {attachments && attachments.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {attachments.map((file, index) => (
            <div 
              key={index} 
              className="bg-gray-100 rounded px-2 py-1 text-xs flex items-center"
            >
              <span className="truncate max-w-[150px]">{file.name}</span>
              <span className="ml-1 text-gray-500">
                ({(file.size / 1024).toFixed(1)} KB)
              </span>
              {onRemoveFile && (
                <button 
                  onClick={() => onRemoveFile(file)}
                  className="ml-1 text-gray-500 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        {onFileUpload && (
          <>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              onChange={handleFileChange}
              disabled={disabled || isRateLimited}
            />
            <button
              type="button"
              onClick={triggerFileUpload}
              disabled={disabled || isRateLimited}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
            >
              <Paperclip className="h-5 w-5" />
            </button>
          </>
        )}
        
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled || isRateLimited}
            maxLength={maxLength}
            rows={1}
            className="w-full p-2 pr-8 resize-none border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {encrypted && (
            <div className="absolute top-2 right-2 text-green-600">
              <Lock className="h-4 w-4" />
            </div>
          )}
        </div>
        
        <button
          type="submit"
          disabled={!message.trim() || disabled || isRateLimited}
          className={`p-2 rounded-full ${
            !message.trim() || disabled || isRateLimited
              ? 'text-gray-400 bg-gray-100'
              : 'text-white bg-primary hover:bg-primary/90'
          }`}
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
