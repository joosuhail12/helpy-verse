
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useThemeContext } from '@/context/ThemeContext';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  enableFileAttachments?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage,
  enableFileAttachments = false
}) => {
  const [message, setMessage] = useState('');
  const { colors } = useThemeContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="flex-1 p-3 rounded-md border resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[60px] max-h-[150px]"
        style={{ borderColor: colors?.border }}
        rows={1}
      />
      <button
        type="submit"
        disabled={!message.trim()}
        className="p-3 rounded-md bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send size={20} />
      </button>
    </form>
  );
};

export default MessageInput;
