
import React, { useState, KeyboardEvent, useEffect, useRef } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { useThemeContext } from '@/context/ThemeContext';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onTyping?: () => void;
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  onTyping,
  disabled = false,
  placeholder = 'Type a message...',
  value,
  onChange
}) => {
  const { colors, features } = useThemeContext();
  const [message, setMessage] = useState('');
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Determine if we're using controlled or uncontrolled input
  const isControlled = value !== undefined && onChange !== undefined;
  const currentValue = isControlled ? value : message;
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    
    if (isControlled) {
      onChange(newValue);
    } else {
      setMessage(newValue);
    }
    
    // Trigger onTyping event when user types
    if (onTyping) {
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Call onTyping
      onTyping();
      
      // Set a timeout to stop triggering typing events if user stops typing
      typingTimeoutRef.current = setTimeout(() => {
        typingTimeoutRef.current = null;
      }, 2000);
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
  
  const handleSend = () => {
    if (!currentValue.trim() || disabled) return;
    
    onSendMessage(currentValue);
    
    if (!isControlled) {
      setMessage('');
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <div className="flex items-end gap-2">
      {features.fileAttachments && (
        <button
          className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          disabled={disabled}
        >
          <Paperclip className="h-5 w-5" />
        </button>
      )}
      <div className="flex-1 relative">
        <textarea
          className="w-full p-3 pr-10 rounded-lg resize-none min-h-[45px] max-h-[120px] overflow-auto focus:outline-none"
          placeholder={placeholder}
          rows={1}
          value={currentValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          style={{ 
            backgroundColor: colors.inputBackground || '#f9f9f9',
            borderColor: colors.border
          }}
        />
      </div>
      <button
        onClick={handleSend}
        disabled={!currentValue.trim() || disabled}
        className={`p-2 rounded-full ${!currentValue.trim() || disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        style={{ backgroundColor: colors.primary, color: colors.primaryForeground }}
        aria-label="Send message"
      >
        <Send className="h-5 w-5" />
      </button>
    </div>
  );
};

export default MessageInput;
