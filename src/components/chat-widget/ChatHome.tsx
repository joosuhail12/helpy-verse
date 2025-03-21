
import React from 'react';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ChatHomeProps {
  onNewChat: () => void;
}

/**
 * Home page for the chat widget showing welcome message and personalization options
 */
const ChatHome = ({ onNewChat }: ChatHomeProps) => {
  return (
    <div className="flex flex-col h-full">
      {/* Hero welcome section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-lg mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Hello there 👋</h2>
        <p className="text-gray-600 mt-1">How can we help you today?</p>
      </div>
      
      {/* Main action card */}
      <div className="px-6 pb-6 flex-1">
        <Card 
          onClick={onNewChat}
          className="cursor-pointer group transition-all hover:shadow-md border border-gray-200 mb-4 overflow-hidden"
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

        {/* Optional personalized tip */}
        <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
          <h4 className="font-medium text-amber-800 text-sm mb-1">Quick Tip</h4>
          <p className="text-sm text-amber-700">
            You can also browse our knowledge base for instant answers to common questions.
          </p>
        </div>
      </div>

      <div className="mt-auto text-sm text-center text-gray-500 px-4 border-t border-gray-100 py-3">
        We typically reply within a few minutes
      </div>
    </div>
  );
};

export default ChatHome;
