
import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Lock } from 'lucide-react';
import { useThemeContext } from '@/context/ThemeContext';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  onTyping?: () => void;
  placeholder?: string;
  disabled?: boolean;
  encrypted?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onTyping,
  placeholder = 'Type your message...',
  disabled = false,
  encrypted = false,
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
  };

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
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
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [message]);

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
      
      <div
        className="flex items-end gap-2 rounded-lg p-2"
        style={{ background: colors.inputBackground }}
      >
        <button
          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Attach file"
          style={{ color: colors.foreground }}
        >
          <Paperclip className="h-5 w-5" />
        </button>
        
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
