
import React, { useState } from 'react';
import { ArrowLeft, Send, PaperclipIcon, Smile } from 'lucide-react';

interface ChatStepProps {
  name: string;
  email: string;
  topic: string;
  message: string;
  setMessage: (message: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  onBack: () => void;
  submitting: boolean;
}

/**
 * Chat interface step for new conversation
 */
const ChatStep: React.FC<ChatStepProps> = ({
  name,
  email,
  topic,
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
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h2 className="font-semibold text-gray-800">{topic}</h2>
          <p className="text-xs text-gray-500">{name} • {email}</p>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        <div className="flex flex-col items-start space-y-4">
          <div className="bg-white p-4 rounded-2xl rounded-tl-none max-w-[85%] shadow-sm border border-gray-100">
            <p className="text-gray-800">
              👋 Hi {name.split(' ')[0]}! How can we help you with your {topic.toLowerCase()} query today?
            </p>
            <span className="text-xs text-gray-500 mt-2 block">Support Team • Just now</span>
          </div>
          
          <div className="w-full flex justify-center my-2">
            <div className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Today, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </div>
      
      <form onSubmit={onSendMessage} className="border-t p-3 flex items-center gap-2 bg-white shadow-md">
        <button
          type="button"
          className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
        >
          <PaperclipIcon className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
        >
          <Smile className="h-5 w-5" />
        </button>
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full py-3 px-4 bg-gray-100 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white shadow-inner"
            placeholder="Type your message..."
            disabled={submitting}
          />
        </div>
        <button
          type="submit"
          className={`bg-primary text-white p-3 rounded-full transition-colors shadow-md ${!message.trim() || submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90 hover:shadow-lg'}`}
          disabled={!message.trim() || submitting}
        >
          {submitting ? (
            <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatStep;
