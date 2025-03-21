
import React from 'react';
import { MessageSquare, ArrowRight, ExternalLink } from 'lucide-react';
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
      {/* Modern welcome header */}
      <div className="bg-gradient-to-r from-primary/20 to-primary/5 px-6 py-8 rounded-b-2xl">
        <h2 className="text-xl font-semibold text-gray-800">Hey there 👋</h2>
        <p className="text-gray-600 mt-1 font-light">
          We're here to help. What can we do for you today?
        </p>
      </div>
      
      {/* Content area */}
      <div className="px-6 py-6 flex-1">
        {/* Main action card */}
        <Card 
          onClick={onNewChat}
          className="cursor-pointer group transition-all hover:shadow-md border-0 bg-white shadow-sm mb-4 overflow-hidden rounded-xl"
        >
          <div className="flex items-center gap-4 p-5">
            <div className="bg-gradient-to-br from-primary to-primary/90 p-3 rounded-full text-white">
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

        {/* Modern quick links */}
        <div className="mt-4 mb-6">
          <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">Quick Links</h4>
          <div className="flex flex-col gap-2.5">
            <a href="#" className="text-sm text-gray-700 hover:text-primary flex items-center gap-1.5 font-medium">
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Visit our help center</span>
            </a>
            <a href="#" className="text-sm text-gray-700 hover:text-primary flex items-center gap-1.5 font-medium">
              <ExternalLink className="h-3.5 w-3.5" />
              <span>View pricing plans</span>
            </a>
          </div>
        </div>

        {/* Personalized tip with modern design */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <h4 className="font-medium text-blue-800 text-sm mb-1">💡 Pro Tip</h4>
          <p className="text-sm text-blue-700">
            Send us a screenshot if you're experiencing an issue - it helps us resolve your problem faster.
          </p>
        </div>
      </div>

      <div className="mt-auto text-xs text-center text-gray-500 px-4 border-t border-gray-100 py-3.5 font-medium">
        Average response time: <span className="text-primary">5 minutes</span>
      </div>
    </div>
  );
};

export default ChatHome;
