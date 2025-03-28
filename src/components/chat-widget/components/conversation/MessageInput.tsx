
import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Lock } from 'lucide-react';
import { useThemeContext } from '@/context/ThemeContext';
import { MessageInputProps } from './types';

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onTyping,
  placeholder = 'Type your message...',
  disabled = false,
  encrypted = false,
  attachments = [],
  onFileUpload,
  onRemoveFile,
  onTypingStart,
  onTypingEnd,
  compact = false,
  onHeightChange,
}) => {
  const { colors } = useThemeContext();
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Trigger typing indicator
    if (onTyping) {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Set a new timeout
      onTyping();
      
      // Set a timeout to clear the typing indicator
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
      }, 3000);
    }
    
    // For ResponsiveConversationView compatibility
    if (onTypingStart) {
      onTypingStart();
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        if (onTypingEnd) onTypingEnd();
        timeoutRef.current = null;
      }, 3000);
    }
  };

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim(), attachments);
      setMessage('');
      
      // Focus the input after sending
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize the textarea
  useEffect(() => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 120);
      textarea.style.height = `${newHeight}px`;
      
      if (onHeightChange) {
        onHeightChange(newHeight + 48); // Account for padding/borders
      }
    }
  }, [message, onHeightChange]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && onFileUpload) {
      onFileUpload(Array.from(e.target.files));
      e.target.value = ''; // Reset the input
    }
  };

  return (
    <div
      className="border-t p-3"
      style={{ borderColor: colors.border, background: colors.background }}
    >
      {encrypted && (
        <div className="flex items-center justify-center mb-1 text-xs text-gray-500">
          <Lock className="h-3 w-3 mr-1" />
          <span>End-to-end encrypted</span>
        </div>
      )}
      
      {/* Attachment previews */}
      {attachments && attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {attachments.map((file, index) => (
            <div key={index} className="flex items-center bg-gray-100 rounded px-2 py-1 text-xs text-gray-700">
              <span className="truncate max-w-[120px]">{file.name}</span>
              {onRemoveFile && (
                <button 
                  onClick={() => onRemoveFile(file)} 
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      
      <div
        className="flex items-end gap-2 rounded-lg p-2"
        style={{ background: colors.inputBackground }}
      >
        {onFileUpload && (
          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              multiple
              onChange={handleFileSelect}
              disabled={disabled}
            />
            <div className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              <Paperclip className="h-5 w-5" style={{ color: colors.foreground }} />
            </div>
          </label>
        )}
        
        <textarea
          ref={inputRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className="flex-1 bg-transparent resize-none outline-none max-h-[120px] min-h-[24px]"
          style={{ color: colors.foreground }}
          disabled={disabled}
        />
        
        <button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className={`p-1 rounded-full ${
            message.trim() ? 'opacity-100' : 'opacity-50'
          }`}
          style={{ 
            background: message.trim() ? colors.primary : 'transparent',
            color: message.trim() ? colors.primaryForeground : colors.foreground
          }}
          aria-label="Send message"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
