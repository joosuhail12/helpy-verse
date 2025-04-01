
import React, { useState, useRef, useEffect } from 'react';
import { useThemeContext } from '@/context/ThemeContext';
import { Send, Paperclip } from 'lucide-react';

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
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { colors, labels } = useThemeContext();

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
      <div className="flex-1 relative">
        <textarea
          className="w-full rounded-lg px-4 py-2 pr-10 max-h-24 min-h-[48px] resize-none focus:outline-none"
          style={{ 
            backgroundColor: colors.inputBackground,
            borderColor: colors.border,
            color: colors.foreground
          }}
          placeholder={placeholder || labels.placeholder || "Type a message..."}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows={1}
        />
      </div>
      <button
        className="ml-2 p-2 rounded-full bg-primary text-white flex items-center justify-center"
        style={{ backgroundColor: colors.primary, color: colors.primaryForeground }}
        onClick={handleSend}
        disabled={!message.trim() || disabled}
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
};

export default MessageInput;
