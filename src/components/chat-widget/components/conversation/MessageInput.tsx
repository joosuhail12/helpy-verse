
import React, { useState, useRef, useEffect } from 'react';
import { useThemeContext } from '@/context/ThemeContext';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  onTyping?: () => void;
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
  const { colors } = useThemeContext();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Auto focus the input when component mounts
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    if (onTyping) {
      onTyping();
    }
  };

  const handleSendMessage = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <div 
      className="chat-input-container"
      style={{ 
        borderColor: colors.border,
        backgroundColor: colors.backgroundSecondary
      }}
    >
      <textarea
        ref={inputRef}
        className="chat-input-textarea"
        style={{ 
          backgroundColor: colors.inputBackground,
          color: colors.foreground,
          borderColor: colors.border,
        }}
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={1}
        disabled={disabled}
      />
      <button
        onClick={handleSendMessage}
        disabled={!message.trim() || disabled}
        className="chat-input-button"
        style={{ 
          backgroundColor: message.trim() ? colors.primary : '#ccc',
          color: message.trim() ? colors.primaryForeground : '#666',
          opacity: disabled ? 0.5 : 1
        }}
      >
        <Send size={18} />
      </button>
    </div>
  );
};

export default MessageInput;
