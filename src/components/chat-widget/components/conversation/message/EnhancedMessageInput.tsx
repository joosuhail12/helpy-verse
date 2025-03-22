
import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Smile, AlertCircle, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useIsMobile } from '@/hooks/use-mobile';
import EmojiPickerButton from '../../conversation/emoji/EmojiPickerButton';

export interface EnhancedMessageInputProps {
  onSendMessage: (e: React.FormEvent) => void;
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  sending: boolean;
  onTyping?: () => void;
  isConnected?: boolean;
  onFileSelect?: (files: File[]) => void;
  queuedMessageCount?: number;
  isOnline?: boolean;
}

/**
 * Enhanced message input component with emoji picker and file attachments
 */
const EnhancedMessageInput: React.FC<EnhancedMessageInputProps> = ({
  onSendMessage,
  newMessage,
  setNewMessage,
  sending,
  onTyping,
  isConnected = true,
  onFileSelect,
  queuedMessageCount = 0,
  isOnline = true
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMobile = useIsMobile();
  
  // Reset typing indicator when component unmounts
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);
  
  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [newMessage]);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    
    // Typing indicator
    if (onTyping) {
      onTyping();
      
      // Reset typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set new timeout - will be cleared if user types again
      typingTimeoutRef.current = setTimeout(() => {
        // This would typically send a "stopped typing" event
      }, 3000);
    }
  };
  
  // Handle emoji selection
  const handleEmojiSelect = (emoji: any) => {
    setNewMessage(prev => prev + emoji.native);
    setShowEmojiPicker(false);
    
    // Focus textarea after emoji selection
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };
  
  // Handle file upload button click
  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0 && onFileSelect) {
      onFileSelect(files);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (newMessage.trim() && !sending) {
        onSendMessage(e);
      }
    }
  };

  // Get connection status message
  const getConnectionMessage = () => {
    if (!isOnline) {
      return (
        <div className="flex items-center gap-2 p-2 mt-2 text-xs rounded bg-gray-100 text-gray-600">
          <WifiOff className="h-3.5 w-3.5" />
          <span>
            {queuedMessageCount > 0 
              ? `You're offline. ${queuedMessageCount} message${queuedMessageCount > 1 ? 's' : ''} will be sent when you reconnect.` 
              : "You're offline. Messages will be sent when you reconnect."}
          </span>
        </div>
      );
    }
    
    if (!isConnected) {
      return (
        <div className="flex items-center gap-2 p-2 mt-2 text-xs rounded bg-yellow-50 text-yellow-600">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>Connecting to chat server...</span>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <form onSubmit={onSendMessage} className="p-3 border-t bg-white">
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={newMessage}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="pr-24 resize-none min-h-[44px] max-h-[120px] py-2.5"
          disabled={sending}
          rows={1}
        />
        
        <div className="absolute bottom-1.5 right-1.5 flex items-center gap-1">
          {/* File upload */}
          {onFileSelect && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                multiple
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={handleFileButtonClick}
                disabled={sending}
              >
                <Paperclip className="h-4 w-4" />
                <span className="sr-only">Attach files</span>
              </Button>
            </>
          )}
          
          {/* Emoji picker button */}
          <EmojiPickerButton
            onEmojiSelect={handleEmojiSelect}
            disabled={sending}
            position={isMobile ? 'top' : 'top-start'}
          />
          
          {/* Send button */}
          <Button
            type="submit"
            size="icon"
            className="h-8 w-8 rounded-full"
            disabled={!newMessage.trim() || sending}
          >
            <Send className={`h-4 w-4 ${sending ? 'opacity-50' : ''}`} />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
      
      {/* Connection status */}
      {getConnectionMessage()}
    </form>
  );
};

export default EnhancedMessageInput;
