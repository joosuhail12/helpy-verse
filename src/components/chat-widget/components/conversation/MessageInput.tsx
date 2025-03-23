
import React, { KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface MessageInputProps {
  onSendMessage: () => Promise<void>;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  placeholder?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  value = '',
  onChange,
  onKeyDown,
  disabled = false,
  placeholder = 'Type a message...'
}) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
    
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  return (
    <div className="flex items-end gap-2">
      <Textarea
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="min-h-10 max-h-32 resize-none"
        rows={1}
      />
      
      <Button
        size="icon"
        disabled={disabled || !value.trim()}
        onClick={() => onSendMessage()}
        className="flex-shrink-0"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default MessageInput;
