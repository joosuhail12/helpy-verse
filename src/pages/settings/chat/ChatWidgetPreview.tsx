
import React from 'react';
import { MessageCircle, MessageSquare } from 'lucide-react';

interface ChatWidgetPreviewProps {
  welcomeMessage?: string;
  welcomeTitle?: string;
  welcomeSubtitle?: string;
  askQuestionButton?: string;
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  userMessageBackground?: string;
  agentMessageBackground?: string;
  headerLogo?: string | null;
  launcherIcon?: string | null;
  position?: 'left' | 'right';
  compactMode?: boolean;
  showTicketStatusBar?: boolean;
  allowEndChat?: boolean;
  enableMessageReactions?: boolean;
  showAgentPresence?: boolean;
  enableDeliveryReceipts?: boolean;
  enableConversationRating?: boolean;
}

const ChatWidgetPreview: React.FC<ChatWidgetPreviewProps> = ({ 
  welcomeMessage = "Hi there! 👋 How can I help you today?",
  welcomeTitle = "Chat Support",
  welcomeSubtitle = "We're here to help",
  askQuestionButton = "Ask a question",
  primaryColor = "#7c3aed",
  backgroundColor = "#ffffff",
  textColor = "#1f2937",
  userMessageBackground = "#eef2ff",
  agentMessageBackground = "#f3f4f6",
  headerLogo = null,
  launcherIcon = null,
  position = "right",
  compactMode = false,
  showTicketStatusBar = true,
  allowEndChat = true,
  enableMessageReactions = true,
  showAgentPresence = true,
  enableDeliveryReceipts = false,
  enableConversationRating = true
}) => {
  return (
    <div className="relative w-full h-[400px] border rounded-md overflow-hidden shadow-md" style={{ backgroundColor }}>
      {/* Chat Header */}
      <div className="p-4" style={{ backgroundColor: primaryColor }}>
        <div className="flex items-center gap-2 text-white">
          {headerLogo ? (
            <img src={headerLogo} alt="Logo" className="h-5 w-auto" />
          ) : (
            <MessageCircle className="h-5 w-5" />
          )}
          <h3 className="font-medium">{welcomeTitle}</h3>
        </div>
      </div>

      {/* Ticket Status Bar */}
      {showTicketStatusBar && (
        <div className="px-4 py-2 bg-gray-50 border-b text-xs" style={{ color: textColor }}>
          Ticket #12345 • Open • Assigned to Support Team
        </div>
      )}

      {/* Chat Messages Area */}
      <div className="p-4 h-[260px] overflow-y-auto">
        {/* Agent Message */}
        <div className="mb-3 max-w-[80%]">
          <div className="rounded-lg p-3 inline-block" style={{ backgroundColor: agentMessageBackground, color: textColor }}>
            <p className="text-sm">{welcomeMessage}</p>
          </div>
          <div className="text-xs mt-1" style={{ color: `${textColor}80` }}>
            Support Agent • 5m ago
            {enableDeliveryReceipts && <span className="ml-2">✓ Read</span>}
          </div>
          {showAgentPresence && (
            <div className="text-xs italic mt-1" style={{ color: `${textColor}80` }}>
              Agent is online
            </div>
          )}
        </div>

        {/* User Message */}
        <div className="mb-3 max-w-[80%] ml-auto">
          <div 
            className="rounded-lg p-3 inline-block text-white"
            style={{ backgroundColor: primaryColor }}
          >
            <p className="text-sm">Hello, I need help with my account</p>
          </div>
          <div className="text-xs mt-1 text-right" style={{ color: `${textColor}80` }}>
            You • 4m ago
            {enableDeliveryReceipts && <span className="ml-2">✓ Delivered</span>}
          </div>
          
          {/* Message Reactions */}
          {enableMessageReactions && (
            <div className="flex gap-1 justify-end mt-1">
              <span className="text-xs bg-gray-100 rounded-full px-2 py-0.5" style={{ color: textColor }}>👍 1</span>
            </div>
          )}
        </div>
      </div>

      {/* Chat Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-3 border-t" style={{ backgroundColor }}>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1"
            style={{ borderColor: "rgb(229, 231, 235)", color: textColor }}
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
            <button className="text-xs hover:underline" style={{ color: `${textColor}80` }}>
              End conversation
            </button>
          </div>
        )}
        
        {/* Conversation Rating */}
        {enableConversationRating && (
          <div className="mt-2 text-xs text-center" style={{ color: `${textColor}80` }}>
            Rate this conversation: 
            <div className="flex justify-center gap-1 mt-1">
              <span className="cursor-pointer">⭐</span>
              <span className="cursor-pointer">⭐</span>
              <span className="cursor-pointer">⭐</span>
              <span className="cursor-pointer">⭐</span>
              <span className="cursor-pointer">⭐</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Chat Launcher - shown when chat is closed */}
      <div className="absolute bottom-4 right-4 bg-primary text-white h-12 w-12 rounded-full flex items-center justify-center shadow-lg" style={{ 
        backgroundColor: primaryColor,
        [position]: '4', // Position based on prop
      }}>
        {launcherIcon ? (
          <img src={launcherIcon} alt="Chat icon" className="h-6 w-6" />
        ) : (
          <MessageSquare className="h-6 w-6" />
        )}
      </div>
    </div>
  );
};

export default ChatWidgetPreview;
