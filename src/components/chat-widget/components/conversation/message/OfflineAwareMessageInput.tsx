
import React, { useRef, useEffect, useState } from 'react';
import { Send, WifiOff } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import FileUploadInput from './FileUploadInput';

interface OfflineAwareMessageInputProps {
  onSendMessage: (e: React.FormEvent) => void;
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  sending: boolean;
  onTyping?: () => void;
  isConnected?: boolean;
  isOnline: boolean;
  queuedMessageCount: number;
  onFileSelect?: (files: File[]) => void;
}

/**
 * Enhanced message input component with offline awareness and responsive design
 */
const OfflineAwareMessageInput: React.FC<OfflineAwareMessageInputProps> = ({
  onSendMessage,
  newMessage,
  setNewMessage,
  sending,
  onTyping,
  isConnected = true,
  isOnline = true,
  queuedMessageCount = 0,
  onFileSelect
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  // Auto-focus input on mount (but not on mobile)
  useEffect(() => {
    if (!isMobile) {
      inputRef.current?.focus();
    }
  }, [isMobile]);
  
  // Handle typing events
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    
    // Notify about typing only if online
    if (onTyping && isOnline) {
      onTyping();
    }
  };
  
  // Make textarea auto-resize
  const handleInput = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, isMobile ? 100 : 120)}px`;
    }
  };
  
  // Handle keyboard events (Enter to send)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage(e as unknown as React.FormEvent);
    }
  };
  
  // Handle file selection
  const handleFileSelect = (files: File[]) => {
    setSelectedFiles(prev => [...prev, ...files]);
    if (onFileSelect) {
      onFileSelect(files);
    }
  };
  
  return (
    <form 
      onSubmit={onSendMessage} 
      className="border-t border-gray-200 bg-white p-2 md:p-3 relative"
    >
      {!isConnected && isOnline && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
          <div className="text-sm text-gray-600 flex items-center">
            <div className="animate-spin mr-2 h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
            Connecting...
          </div>
        </div>
      )}
      
      {!isOnline && queuedMessageCount > 0 && (
        <div className="px-2 pb-2 text-xs text-amber-600 flex items-center">
          <WifiOff className="h-3 w-3 mr-1" />
          <span>You're offline. {queuedMessageCount} message{queuedMessageCount !== 1 ? 's' : ''} will send when connected.</span>
        </div>
      )}
      
      <div className="flex items-end gap-2">
        {/* File upload */}
        {onFileSelect && (
          <FileUploadInput
            onFileSelect={handleFileSelect}
            disabled={sending}
            maxFileSize={10}
          />
        )}
        
        <div className="relative flex-grow border rounded-lg focus-within:ring-1 focus-within:ring-primary">
          <textarea 
            ref={inputRef}
            value={newMessage}
            onChange={handleChange}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={isOnline ? "Type your message..." : "Type your message (offline mode)"}
            className="w-full p-2 md:p-3 max-h-32 min-h-[40px] resize-none focus:outline-none rounded-lg text-sm md:text-base"
            disabled={sending}
            style={{ height: '40px' }}
          />
        </div>
        
        <button 
          type="submit" 
          className="bg-primary text-white p-2 md:p-3 rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          disabled={(!newMessage.trim() && selectedFiles.length === 0) || sending}
        >
          {sending ? (
            <div className="h-4 w-4 md:h-5 md:w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="h-4 w-4 md:h-5 md:w-5" />
          )}
        </button>
      </div>
    </form>
  );
};

export default OfflineAwareMessageInput;
