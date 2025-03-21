
import React from 'react';
import { MessageSquare, Users, Bot, HelpCircle, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ChatHomeProps {
  onNewChat: () => void;
}

/**
 * Home page for the chat widget showing welcome message and options
 */
const ChatHome = ({ onNewChat }: ChatHomeProps) => {
  return (
    <div className="flex flex-col h-full p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Welcome 👋</h2>
        <p className="text-gray-500 mt-1">How can we help you today?</p>
      </div>
      
      <div className="flex-1 flex flex-col gap-3">
        <Card 
          onClick={onNewChat}
          className="cursor-pointer group transition-all hover:shadow-md border border-gray-200"
        >
          <div className="flex items-center gap-4 p-4">
            <div className="bg-primary/10 p-2.5 rounded-full text-primary">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-800 flex items-center gap-1.5">
                Start a conversation
                <ArrowRight className="h-3.5 w-3.5 text-primary opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
              </h3>
              <p className="text-sm text-gray-500">Get help from our support team</p>
            </div>
          </div>
        </Card>

        <Card className="cursor-pointer group transition-all hover:shadow-md border border-gray-200">
          <div className="flex items-center gap-4 p-4">
            <div className="bg-blue-100 p-2.5 rounded-full text-blue-600">
              <Bot className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-800 flex items-center gap-1.5">
                Chat with AI
                <ArrowRight className="h-3.5 w-3.5 text-blue-600 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
              </h3>
              <p className="text-sm text-gray-500">Get instant answers from our AI</p>
            </div>
          </div>
        </Card>

        <Card className="cursor-pointer group transition-all hover:shadow-md border border-gray-200">
          <div className="flex items-center gap-4 p-4">
            <div className="bg-amber-100 p-2.5 rounded-full text-amber-600">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-800 flex items-center gap-1.5">
                Help Center
                <ArrowRight className="h-3.5 w-3.5 text-amber-600 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
              </h3>
              <p className="text-sm text-gray-500">Browse our knowledge base</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6 text-sm text-center text-gray-500 px-4 border-t border-gray-100 pt-4">
        We typically reply within a few hours during business hours
      </div>
    </div>
  );
};

export default ChatHome;
