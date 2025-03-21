
import React from 'react';
import { ArrowLeft, Send } from 'lucide-react';

interface ChatStepProps {
  name: string;
  email: string;
  message: string;
  setMessage: (message: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  onBack: () => void;
  submitting: boolean;
}

/**
 * Chat message input step for new conversation
 */
const ChatStep: React.FC<ChatStepProps> = ({
  name,
  email,
  message,
  setMessage,
  onSendMessage,
  onBack,
  submitting
}) => {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-4 py-3 border-b flex items-center gap-3 sticky top-0 bg-white z-10 shadow-sm">
        <button 
          onClick={onBack} 
          className="text-gray-500 hover:text-gray-700 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          disabled={submitting}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h2 className="font-semibold text-gray-800">New Conversation</h2>
          <p className="text-xs text-gray-500">{name} ({email})</p>
        </div>
      </div>
      
      <div className="flex-1 p-4 bg-gray-50 overflow-y-auto">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm text-gray-700">
            Hi {name.split(' ')[0]}, how can we help you today?
          </p>
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-100">
        <form onSubmit={onSendMessage} className="relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="w-full border border-gray-200 rounded-lg p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-transparent resize-none"
            rows={3}
            disabled={submitting}
            required
          />
          <button
            type="submit"
            className="absolute right-3 bottom-3 text-primary hover:text-primary/80 disabled:text-gray-400"
            disabled={submitting || !message.trim()}
          >
            <Send className="h-6 w-6" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatStep;
