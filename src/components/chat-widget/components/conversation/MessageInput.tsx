
import React, { KeyboardEvent, ChangeEvent, useState } from 'react';
import { Send } from 'lucide-react';

export interface MessageInputProps {
  value?: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onSendMessage: () => Promise<void>;
  placeholder?: string;
  disabled?: boolean;
  onKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  // Add these props to support both patterns
  messageText?: string;
  setMessageText?: React.Dispatch<React.SetStateAction<string>>;
  isSending?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onSendMessage,
  placeholder = 'Type a message...',
  disabled = false,
  onKeyDown,
  // Support both patterns
  messageText,
  setMessageText,
  isSending = false,
}) => {
  // Use the appropriate value depending on which props pattern is used
  const inputValue = messageText !== undefined ? messageText : value;
  const isInputDisabled = disabled || isSending;
  
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (setMessageText) {
      setMessageText(e.target.value);
    }
    if (onChange) {
      onChange(e);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputValue?.trim()) {
        onSendMessage();
      }
    }
    
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  const handleSendClick = async () => {
    if (inputValue?.trim() && !isInputDisabled) {
      await onSendMessage();
    }
  };

  return (
    <div className="border-t border-gray-800 p-3 bg-black">
      <div className="flex items-end space-x-2">
        <textarea
          value={inputValue || ''}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isInputDisabled}
          className="flex-1 resize-none border border-gray-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary min-h-[40px] max-h-32 bg-gray-900 text-white"
          style={{ overflow: 'auto' }}
        />
        <button
          onClick={handleSendClick}
          disabled={!inputValue?.trim() || isInputDisabled}
          className={`p-2 rounded-full ${
            inputValue?.trim() && !isInputDisabled
              ? 'bg-primary text-white hover:bg-primary/90'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
