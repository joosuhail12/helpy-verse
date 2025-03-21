
import React, { useRef } from 'react';
import { Send, Paperclip } from 'lucide-react';
import EmojiPickerButton from '../emoji/EmojiPickerButton';

interface EnhancedMessageInputProps {
  onSendMessage: (e: React.FormEvent) => void;
  newMessage: string;
  setNewMessage: (message: string) => void;
  sending: boolean;
}

/**
 * Enhanced component for typing and sending messages with additional features
 */
const EnhancedMessageInput: React.FC<EnhancedMessageInputProps> = ({
  onSendMessage,
  newMessage,
  setNewMessage,
  sending
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(newMessage + emoji);
    
    // Focus back on textarea after emoji selection
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send message on Enter without Shift key
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (newMessage.trim()) {
        onSendMessage(e as any);
      }
    }
  };

  return (
    <div className="p-4 border-t border-gray-100 bg-white">
      <form onSubmit={onSendMessage} className="relative">
        <textarea
          ref={textareaRef}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here..."
          className="w-full border border-gray-200 rounded-lg p-3 pr-20 focus:outline-none focus:ring-2 focus:ring-gray-900/30 focus:border-transparent resize-none"
          rows={2}
          disabled={sending}
          autoFocus
        />
        <div className="absolute right-3 bottom-3 flex items-center space-x-1">
          <EmojiPickerButton onEmojiSelect={handleEmojiSelect} />
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
            disabled={sending}
            aria-label="Attach file"
          >
            <Paperclip className="h-5 w-5" />
          </button>
          <button
            type="submit"
            className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full text-gray-900"
            disabled={sending || !newMessage.trim()}
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default EnhancedMessageInput;
