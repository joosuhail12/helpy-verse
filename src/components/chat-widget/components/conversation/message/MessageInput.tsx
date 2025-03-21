
import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (e: React.FormEvent) => void;
  newMessage: string;
  setNewMessage: (message: string) => void;
  sending: boolean;
}

/**
 * Component for typing and sending messages
 */
const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  newMessage,
  setNewMessage,
  sending
}) => {
  return (
    <div className="p-4 border-t border-gray-100 bg-white">
      <form onSubmit={onSendMessage} className="relative">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message here..."
          className="w-full border border-gray-200 rounded-lg p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-transparent resize-none"
          rows={3}
          disabled={sending}
          autoFocus
        />
        <button
          type="submit"
          className="absolute right-3 bottom-3 text-primary hover:text-primary/80 disabled:text-gray-400"
          disabled={sending || !newMessage.trim()}
        >
          <Send className="h-6 w-6" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
