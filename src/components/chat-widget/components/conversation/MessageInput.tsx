
import React, { useState, useRef, useEffect } from 'react';
import { useThemeContext } from '@/context/ThemeContext';
import { Send, Paperclip, Smile } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onTyping?: (isTyping: boolean) => void;
  disabled?: boolean;
  placeholder?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  onTyping,
  disabled = false,
  placeholder = "Type a message..."
}) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { colors, labels } = useThemeContext();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [message]);

  // Handle typing indicator
  useEffect(() => {
    if (message && !isTyping) {
      setIsTyping(true);
      if (onTyping) onTyping(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        if (onTyping) onTyping(false);
      }
    }, 2000);

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [message, isTyping, onTyping]);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-3 flex items-end">
      <div className="relative flex-1">
        <textarea
          ref={textareaRef}
          className="w-full rounded-lg pl-4 pr-12 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
          style={{ 
            backgroundColor: colors.inputBackground || '#f9fafb',
            borderColor: colors.border || '#e5e7eb',
            color: colors.foreground || '#111827',
            minHeight: '48px',
            maxHeight: '150px'
          }}
          placeholder={placeholder || labels?.placeholder || "Type a message..."}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows={1}
        />
        <div className="absolute right-3 bottom-3 flex items-center gap-2">
          <button 
            type="button"
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Attach files"
          >
            <Paperclip size={18} />
          </button>
          <button 
            type="button"
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Add emoji"
          >
            <Smile size={18} />
          </button>
        </div>
      </div>
      <button
        className="ml-2 p-3 rounded-full bg-primary text-white flex items-center justify-center transition-colors disabled:opacity-60 disabled:cursor-not-allowed hover:bg-primary/90"
        style={{ backgroundColor: colors.primary, color: colors.primaryForeground }}
        onClick={handleSend}
        disabled={!message.trim() || disabled}
        title="Send message"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
};

export default MessageInput;
