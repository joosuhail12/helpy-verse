
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useThemeContext } from '@/context/ThemeContext';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  onTyping: (isTyping: boolean) => void;
  disabled?: boolean;
  placeholder?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  onTyping,
  disabled = false,
  placeholder = 'Type your message...'
}) => {
  const [message, setMessage] = useState('');
  const { colors } = useThemeContext();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Handle typing indicator
  useEffect(() => {
    if (message.trim() && !isTyping) {
      setIsTyping(true);
      onTyping(true);
    }

    // Clear any existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set a new timeout
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        onTyping(false);
      }
    }, 1500);

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [message, isTyping, onTyping]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
      // Reset typing indicator
      setIsTyping(false);
      onTyping(false);
      // Focus input after sending
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  return (
    <div className="flex items-center p-3">
      <textarea
        ref={inputRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
        rows={1}
        style={{
          minHeight: '40px',
          maxHeight: '120px',
          borderColor: colors.border || '#e2e8f0'
        }}
      />
      <button
        onClick={handleSendMessage}
        disabled={!message.trim() || disabled}
        className="ml-2 p-2 rounded-full"
        style={{
          backgroundColor: message.trim() ? colors.primary : '#e2e8f0',
          color: message.trim() ? 'white' : '#9ca3af',
          cursor: message.trim() && !disabled ? 'pointer' : 'not-allowed'
        }}
      >
        <Send size={18} />
      </button>
    </div>
  );
};

export default MessageInput;
