
import React, { KeyboardEvent, ChangeEvent } from 'react';
import { Send } from 'lucide-react';

export interface MessageInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onSendMessage: () => Promise<void>;
  placeholder?: string;
  disabled?: boolean;
  onKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onSendMessage,
  placeholder = 'Type a message...',
  disabled = false,
  onKeyDown,
}) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        onSendMessage();
      }
    }
    
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  return (
    <div className="border-t p-3 bg-white">
      <div className="flex items-end space-x-2">
        <textarea
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 resize-none border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary min-h-[80px] max-h-32"
          style={{ overflow: 'auto' }}
        />
        <button
          onClick={() => value.trim() && onSendMessage()}
          disabled={!value.trim() || disabled}
          className={`p-2 rounded-full ${
            value.trim() && !disabled
              ? 'bg-primary text-white hover:bg-primary/90'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
          aria-label="Send message"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
