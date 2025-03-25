
import React, { useState, useEffect, useRef } from 'react';
import { useThemeContext } from '@/context/ThemeContext';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onTyping?: () => void;
  isDisabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  onTyping,
  isDisabled = false
}) => {
  const { colors, labels } = useThemeContext();
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-focus the input when the component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleTyping = () => {
    if (onTyping) {
      onTyping();
      
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set new timeout to stop typing indication after 3 seconds
      typingTimeoutRef.current = setTimeout(() => {
        typingTimeoutRef.current = null;
      }, 3000);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() && !isDisabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="border-t p-3 flex items-end"
      style={{ borderColor: colors.border }}
    >
      <textarea
        ref={inputRef}
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          handleTyping();
        }}
        onKeyDown={handleKeyDown}
        placeholder={labels.messagePlaceholder || "Type a message..."}
        className="flex-1 resize-none outline-none max-h-24 p-2 rounded"
        style={{ 
          backgroundColor: colors.inputBackground || '#f9f9f9',
          color: colors.foreground
        }}
        disabled={isDisabled}
        rows={1}
      />
      <button
        type="submit"
        className={`ml-2 p-2 rounded-full ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
        style={{ 
          color: message.trim() ? colors.primary : `${colors.foreground}88` 
        }}
        disabled={!message.trim() || isDisabled}
        aria-label="Send message"
      >
        <Send size={20} />
      </button>
    </form>
  );
};

export default MessageInput;
