
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useThemeContext } from '@/context/ThemeContext';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isDisabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  isDisabled = false 
}) => {
  const { colors } = useThemeContext();
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim() && !isDisabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="p-3 border-t flex items-end gap-2" style={{ borderColor: colors.border }}>
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        rows={1}
        className="flex-1 resize-none border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:border-primary min-h-[42px] max-h-[120px] overflow-y-auto"
        style={{ 
          backgroundColor: colors.inputBackground,
          borderColor: colors.border,
          color: colors.foreground,
          focusBorderColor: colors.primary
        }}
        disabled={isDisabled}
      />
      <button
        onClick={handleSend}
        disabled={!message.trim() || isDisabled}
        className="flex-shrink-0 rounded-full p-2 transition-colors disabled:opacity-50"
        style={{ 
          backgroundColor: message.trim() ? colors.primary : `${colors.primary}80`,
          color: colors.primaryForeground 
        }}
      >
        <Send size={18} />
      </button>
    </div>
  );
};

export default MessageInput;
