
import React, { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface EnhancedMessageInputProps {
  onSendMessage: (e: React.FormEvent) => void;
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  sending: boolean;
  onTyping?: () => void;
  isConnected?: boolean;
}

/**
 * Enhanced message input component with typing detection
 */
const EnhancedMessageInput: React.FC<EnhancedMessageInputProps> = ({
  onSendMessage,
  newMessage,
  setNewMessage,
  sending,
  onTyping,
  isConnected = true
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  // Handle typing events
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    
    // Notify about typing
    if (onTyping) {
      onTyping();
    }
  };
  
  // Make textarea auto-resize
  const handleInput = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  };
  
  // Handle keyboard events (Enter to send)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage(e as unknown as React.FormEvent);
    }
  };
  
  return (
    <form 
      onSubmit={onSendMessage} 
      className="border-t border-gray-200 bg-white p-3 relative"
    >
      {!isConnected && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
          <div className="text-sm text-gray-600 flex items-center">
            <div className="animate-spin mr-2 h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
            Connecting...
          </div>
        </div>
      )}
      
      <div className="flex items-end gap-2">
        <div className="relative flex-grow border rounded-lg focus-within:ring-1 focus-within:ring-primary">
          <textarea 
            ref={inputRef}
            value={newMessage}
            onChange={handleChange}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="w-full p-3 max-h-32 min-h-[40px] resize-none focus:outline-none rounded-lg"
            disabled={sending || !isConnected}
            style={{ height: '40px' }}
          />
        </div>
        
        <button 
          type="submit" 
          className="bg-primary text-white p-3 rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          disabled={!newMessage.trim() || sending || !isConnected}
        >
          {sending ? (
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </div>
    </form>
  );
};

export default EnhancedMessageInput;
