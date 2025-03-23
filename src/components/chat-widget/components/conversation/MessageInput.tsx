
import React, { KeyboardEvent } from 'react';
import { SendHorizonal } from 'lucide-react';

export interface MessageInputProps {
  onSendMessage: () => Promise<void>;
  messageText: string;
  setMessageText: React.Dispatch<React.SetStateAction<string>>;
  isSending: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  messageText,
  setMessageText,
  isSending
}) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="flex items-end gap-2">
      <textarea
        className="flex-1 min-h-10 max-h-32 resize-none border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-primary"
        placeholder="Type your message here..."
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        disabled={isSending}
      />
      <button
        className="bg-primary text-white p-2 rounded-md disabled:opacity-50"
        onClick={() => onSendMessage()}
        disabled={!messageText.trim() || isSending}
      >
        <SendHorizonal className="h-5 w-5" />
      </button>
    </div>
  );
};

export default MessageInput;
