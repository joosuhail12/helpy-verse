
import React, { useState, useRef, KeyboardEvent } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';
import { useThemeContext } from '@/context/ThemeContext';

export interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onChange?: (text: string) => void;
  onTyping?: () => void;
  placeholder?: string;
  disabled?: boolean;
  isDisabled?: boolean; // Alternative prop name for disabled
  showAttachments?: boolean;
  showEmoji?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onChange,
  onTyping,
  placeholder = 'Type a message...',
  disabled = false,
  isDisabled, // Use this if provided, otherwise use disabled
  showAttachments = true,
  showEmoji = true
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { colors } = useThemeContext();
  
  // Use isDisabled if provided, otherwise use disabled
  const isInputDisabled = isDisabled !== undefined ? isDisabled : disabled;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.target.value;
    setMessage(newMessage);
    
    // Call the onChange handler if provided
    if (onChange) {
      onChange(newMessage);
    }
    
    // Call onTyping if provided
    if (onTyping && newMessage.trim()) {
      onTyping();
    }
    
    // Auto-resize the textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (message.trim() && !isInputDisabled) {
      onSendMessage(message.trim());
      setMessage('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  return (
    <div 
      className="flex items-end p-2 border rounded-lg"
      style={{ 
        borderColor: colors.border, 
        backgroundColor: colors.inputBackground || colors.background 
      }}
    >
      {showAttachments && (
        <button 
          className="p-2 rounded-full hover:bg-gray-200 text-gray-500"
          aria-label="Attach files"
        >
          <Paperclip size={20} />
        </button>
      )}
      
      <textarea
        ref={textareaRef}
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isInputDisabled}
        className="flex-1 outline-none border-none resize-none bg-transparent py-2 px-3 max-h-32"
        style={{ color: colors.foreground }}
        rows={1}
      />
      
      {showEmoji && (
        <button 
          className="p-2 rounded-full hover:bg-gray-200 text-gray-500"
          aria-label="Add emoji"
        >
          <Smile size={20} />
        </button>
      )}
      
      <button
        onClick={handleSend}
        disabled={!message.trim() || isInputDisabled}
        className={`p-2 rounded-full ${message.trim() && !isInputDisabled ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}
        aria-label="Send message"
      >
        <Send size={20} />
      </button>
    </div>
  );
};

export default MessageInput;
