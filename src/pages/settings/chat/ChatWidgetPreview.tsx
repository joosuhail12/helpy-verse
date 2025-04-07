
import React from 'react';
import { MessageCircle } from 'lucide-react';

interface ChatWidgetPreviewProps {
  welcomeMessage?: string;
  primaryColor?: string;
  showTicketStatusBar?: boolean;
  allowEndChat?: boolean;
  enableMessageReactions?: boolean;
}

const ChatWidgetPreview: React.FC<ChatWidgetPreviewProps> = ({ 
  welcomeMessage = "Hi there! 👋 How can I help you today?",
  primaryColor = "#7c3aed",
  showTicketStatusBar = true,
  allowEndChat = true,
  enableMessageReactions = true
}) => {
  return (
    <div className="relative w-full h-[400px] border rounded-md overflow-hidden bg-white shadow-md">
      {/* Chat Header */}
      <div className="p-4" style={{ backgroundColor: primaryColor }}>
        <div className="flex items-center gap-2 text-white">
          <MessageCircle className="h-5 w-5" />
          <h3 className="font-medium">Chat Support</h3>
        </div>
      </div>

      {/* Ticket Status Bar */}
      {showTicketStatusBar && (
        <div className="px-4 py-2 bg-gray-50 border-b text-xs text-gray-500">
          Ticket #12345 • Open • Assigned to Support Team
        </div>
      )}

      {/* Chat Messages Area */}
      <div className="p-4 h-[260px] overflow-y-auto">
        {/* Agent Message */}
        <div className="mb-3 max-w-[80%]">
          <div className="bg-gray-100 rounded-lg p-3 inline-block">
            <p className="text-sm">{welcomeMessage}</p>
          </div>
          <div className="text-xs text-gray-500 mt-1">Support Agent • 5m ago</div>
        </div>

        {/* User Message */}
        <div className="mb-3 max-w-[80%] ml-auto">
          <div 
            className="rounded-lg p-3 inline-block text-white"
            style={{ backgroundColor: primaryColor }}
          >
            <p className="text-sm">Hello, I need help with my account</p>
          </div>
          <div className="text-xs text-gray-500 mt-1 text-right">You • 4m ago</div>
          
          {/* Message Reactions */}
          {enableMessageReactions && (
            <div className="flex gap-1 justify-end mt-1">
              <span className="text-xs bg-gray-100 rounded-full px-2 py-0.5">👍 1</span>
            </div>
          )}
        </div>
      </div>

      {/* Chat Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-3 border-t bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1"
            style={{ focusRing: primaryColor }}
          />
          <button 
            className="px-3 py-2 rounded-md text-white text-sm"
            style={{ backgroundColor: primaryColor }}
          >
            Send
          </button>
        </div>
        
        {/* End Chat Button */}
        {allowEndChat && (
          <div className="mt-2 text-center">
            <button className="text-xs text-gray-500 hover:underline">
              End conversation
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWidgetPreview;
