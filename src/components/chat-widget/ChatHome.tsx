
import React from 'react';
import { MessageSquare, Users, Bot, HelpCircle } from 'lucide-react';

interface ChatHomeProps {
  onNewChat: () => void;
}

/**
 * Home page for the chat widget showing welcome message and options
 */
const ChatHome = ({ onNewChat }: ChatHomeProps) => {
  return (
    <div className="flex flex-col h-full p-4">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-semibold text-gray-800">Welcome to Support</h2>
        <p className="text-gray-500 text-sm mt-1">How can we help you today?</p>
      </div>
      
      <div className="flex-1 flex flex-col gap-3">
        <button 
          onClick={onNewChat}
          className="flex items-center gap-3 p-3 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="bg-primary/10 p-2 rounded-full text-primary">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div className="text-left">
            <h3 className="font-medium text-gray-800">Start a conversation</h3>
            <p className="text-xs text-gray-500">Get help from our support team</p>
          </div>
        </button>

        <button 
          className="flex items-center gap-3 p-3 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="bg-blue-100 p-2 rounded-full text-blue-600">
            <Bot className="h-5 w-5" />
          </div>
          <div className="text-left">
            <h3 className="font-medium text-gray-800">Chat with AI</h3>
            <p className="text-xs text-gray-500">Get instant answers from our AI</p>
          </div>
        </button>

        <button 
          className="flex items-center gap-3 p-3 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="bg-amber-100 p-2 rounded-full text-amber-600">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div className="text-left">
            <h3 className="font-medium text-gray-800">Help Center</h3>
            <p className="text-xs text-gray-500">Browse our knowledge base</p>
          </div>
        </button>
      </div>

      <div className="mt-4 text-xs text-center text-gray-400">
        We typically reply within a few hours during business hours
      </div>
    </div>
  );
};

export default ChatHome;
